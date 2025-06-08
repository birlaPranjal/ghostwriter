"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Globe, SkipForward } from "lucide-react"
import { BlogDisplay } from "@/components/dashboard/blog-display"
import { useToast } from "@/components/ui/use-toast"

interface ContentGeneratorProps {
  type: "blog" | "story" | "speech"
}

export function ContentGenerator({ type }: ContentGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("professional")
  const [style, setStyle] = useState("informative")
  const [emotion, setEmotion] = useState("neutral")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)
  const [title, setTitle] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
          style,
          emotion,
          type,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate content")
      }

      const data = await response.json()
      setContent(data.content)
      setTitle(data.title)
    } catch (error: any) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content || !title) {
      toast({
        title: "Error",
        description: "Please generate content first",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/saveContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          tone,
          style,
          emotion,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save content")
      }

      toast({
        title: "Success",
        description: "Content saved successfully",
      })
    } catch (error: any) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePublish = async () => {
    if (!content || !title) {
      toast({
        title: "Error",
        description: "Please generate content first",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/publishBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          type,
          tone,
          style,
          emotion,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          // Handle duplicate blog
          toast({
            title: "Duplicate Blog",
            description: "A blog with this title already exists. Would you like to edit it?",
            action: {
              label: "Edit",
              onClick: () => window.open(`/dashboard/content/${data.blogId}/edit`, '_blank')
            }
          })
          return
        }
        throw new Error(data.error || "Failed to publish blog")
      }

      toast({
        title: "Success",
        description: "Blog published successfully",
      })
      
      // Open the published blog in a new tab using the blogId
      window.open(`/dashboard/content/${data.blogId}`, '_blank')
    } catch (error: any) {
      console.error("Error publishing blog:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-purple-950/20 border-purple-900/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generate {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <div className="flex items-center space-x-2">
              <Label htmlFor="skip-animation" className="text-sm text-gray-400">Skip Animation</Label>
              <Switch
                id="skip-animation"
                checked={skipAnimation}
                onCheckedChange={setSkipAnimation}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              placeholder="Enter your topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-purple-950/20 border-purple-900/30"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-purple-950/20 border-purple-900/30">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-purple-950/20 border-purple-900/30">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="bg-purple-950/20 border-purple-900/30">
                  <SelectValue placeholder="Select emotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SkipForward className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {content && (
          <motion.div
            initial={skipAnimation ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: skipAnimation ? 0 : 0.5 }}
          >
            <BlogDisplay
              title={title}
              content={content}
              tone={tone}
              style={style}
              emotion={emotion}
              onTTS={() => {}}
            />
            
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={handleSave}
                className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Library
              </Button>
              <Button
                onClick={handlePublish}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Globe className="mr-2 h-4 w-4" />
                Publish Blog
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
