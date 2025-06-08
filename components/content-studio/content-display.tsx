"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Copy, Download, Loader2, Globe } from "lucide-react"
import Image from "next/image"

interface ContentDisplayProps {
  content: {
    _id: string
    title: string
    content: string
    type: string
    metadata: any
    published: boolean
    publishedAt?: Date
  }
}

export function ContentDisplay({ content }: ContentDisplayProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [generatingImage, setGeneratingImage] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const generateImage = async () => {
    setGeneratingImage(true)
    try {
      // Generate image using Pollinations API
      const prompt = `Create a beautiful image for ${content.title}`
      const encodedPrompt = encodeURIComponent(prompt)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`
      setImageUrl(imageUrl)
    } catch (error) {
      toast.error("Failed to generate image")
      console.error(error)
    } finally {
      setGeneratingImage(false)
    }
  }

  const shareContent = async () => {
    try {
      const shareUrl = `${window.location.origin}/content-studio/${content.type}/${content._id}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
      console.error(error)
    }
  }

  const downloadContent = () => {
    const element = document.createElement("a")
    const file = new Blob([content.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${content.title}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const publishContent = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/content/${content._id}/publish`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to publish content")
      }

      toast.success("Content published successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to publish content")
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{content.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareContent}
                className="flex items-center"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadContent}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={generateImage}
              disabled={generatingImage}
              className="w-full"
            >
              {generatingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          )}

          <div className="prose prose-invert max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>

          {content.metadata && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Content Details</h3>
              <div className="grid gap-2">
                {Object.entries(content.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!content.published && (
            <Button
              onClick={publishContent}
              disabled={publishing}
              className="w-full"
            >
              {publishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Publish Content
                </>
              )}
            </Button>
          )}

          {content.published && content.publishedAt && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center text-sm text-green-400">
              Published on {new Date(content.publishedAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 