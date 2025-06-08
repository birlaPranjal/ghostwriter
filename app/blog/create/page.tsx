"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function CreateBlogPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    prompt: "",
    imageUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create blog post")
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "Blog post created successfully",
      })
      router.push(`/blog/${data.id}`)
    } catch (error) {
      console.error("Error creating blog:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateImage = async () => {
    if (!formData.title && !formData.prompt) {
      toast({
        title: "Error",
        description: "Please enter a title or image prompt first",
        variant: "destructive",
      })
      return
    }

    setGeneratingImage(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt || `A beautiful illustration representing: ${formData.title}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }))
      toast({
        title: "Success",
        description: "Image generated successfully",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingImage(false)
    }
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-purple-950/20 border-purple-900/30">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200">
                  Title
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter your blog title"
                  required
                />
              </div>

              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-200">
                  Image Prompt (Optional)
                </label>
                <Input
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  placeholder="Describe the image you want to generate"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  onClick={generateImage}
                  disabled={generatingImage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>

                {formData.imageUrl && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={formData.imageUrl}
                      alt="Generated blog image"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-200">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Write your blog content here..."
                  className="min-h-[300px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Publish Blog
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 