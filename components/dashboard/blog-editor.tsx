"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Save, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { getImageUrl } from "@/lib/pexels"
import { BlogDisplay } from "./blog-display"

interface BlogEditorProps {
  blogId?: string
  initialTitle?: string
  initialContent?: string
  initialTone?: string
  initialStyle?: string
  initialEmotion?: string
  initialImageUrl?: string | null
  isEditing?: boolean
}

const tones = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Humorous",
  "Serious",
  "Enthusiastic",
  "Neutral"
]

const styles = [
  "Narrative",
  "Descriptive",
  "Persuasive",
  "Expository",
  "Analytical",
  "Conversational",
  "Technical",
  "Creative"
]

const emotions = [
  "Happy",
  "Sad",
  "Angry",
  "Excited",
  "Calm",
  "Anxious",
  "Inspired",
  "Neutral"
]

export function BlogEditor({
  blogId,
  initialTitle = "",
  initialContent = "",
  initialTone = "Professional",
  initialStyle = "Narrative",
  initialEmotion = "Neutral",
  initialImageUrl = null,
  isEditing = false
}: BlogEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tone, setTone] = useState(initialTone)
  const [style, setStyle] = useState(initialStyle)
  const [emotion, setEmotion] = useState(initialEmotion)
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isDraft, setIsDraft] = useState(true)

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = isEditing ? `/api/blog/${blogId}` : '/api/blog'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tone,
          style,
          emotion,
          imageUrl,
          published: publish,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save blog')
      }

      const data = await response.json()
      toast.success(
        publish 
          ? 'Blog published successfully!' 
          : isEditing 
            ? 'Blog updated successfully!' 
            : 'Blog saved as draft!'
      )
      
      if (publish) {
        router.push(`/blog/${data.id}`)
      } else {
        router.push(`/dashboard/content/${data.id}`)
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Failed to save blog. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!title) {
      toast.error('Please enter a title first')
      return
    }

    setIsGeneratingImage(true)
    try {
      const image = await getImageUrl(title)
      setImageUrl(image)
      toast.success('Image generated successfully!')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  if (isPreviewMode) {
    return (
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
            onClick={() => setIsPreviewMode(false)}
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Exit Preview
          </Button>
        </div>
        <BlogDisplay
          title={title}
          content={content}
          tone={tone}
          style={style}
          emotion={emotion}
          imageUrl={imageUrl}
          authorId=""
          blogId=""
          authorName="Anonymous"
          contentLength="descriptive"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold ghost-glow">
              {isEditing ? 'Edit Blog' : 'Create New Blog'}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                onClick={() => setIsPreviewMode(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-2">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog title"
                  className="bg-purple-950/20 border-purple-900/30 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-purple-300 mb-2">
                    Tone
                  </label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-purple-950/20 border-purple-900/30 text-white">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-900/30">
                      {tones.map((t) => (
                        <SelectItem key={t} value={t} className="text-white">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-purple-300 mb-2">
                    Style
                  </label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="bg-purple-950/20 border-purple-900/30 text-white">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-900/30">
                      {styles.map((s) => (
                        <SelectItem key={s} value={s} className="text-white">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="emotion" className="block text-sm font-medium text-purple-300 mb-2">
                    Emotion
                  </label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger className="bg-purple-950/20 border-purple-900/30 text-white">
                      <SelectValue placeholder="Select emotion" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-purple-900/30">
                      {emotions.map((e) => (
                        <SelectItem key={e} value={e} className="text-white">
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-purple-300 mb-2">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  className="min-h-[400px] bg-purple-950/20 border-purple-900/30 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Featured Image
                </label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Blog cover"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Image'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                onClick={(e) => handleSubmit(e, false)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isLoading}
              >
                {isLoading ? (
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
    </motion.div>
  )
} 