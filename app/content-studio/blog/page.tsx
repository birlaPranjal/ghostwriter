"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function BlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    tone: "Professional",
    style: "Narrative",
    emotion: "Neutral",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "blog",
          title: formData.title,
          prompt: formData.prompt,
          parameters: {
            tone: formData.tone,
            style: formData.style,
            emotion: formData.emotion,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create blog")
      }

      const data = await response.json()
      toast.success("Blog created successfully!")
      router.push(`/content-studio/blog/${data._id}`)
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter blog title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="Describe what you want to write about..."
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Humorous">Humorous</SelectItem>
                    <SelectItem value="Serious">Serious</SelectItem>
                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select
                  value={formData.style}
                  onValueChange={(value) =>
                    setFormData({ ...formData, style: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Descriptive">Descriptive</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                    <SelectItem value="Expository">Expository</SelectItem>
                    <SelectItem value="Analytical">Analytical</SelectItem>
                    <SelectItem value="Conversational">Conversational</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emotion</label>
                <Select
                  value={formData.emotion}
                  onValueChange={(value) =>
                    setFormData({ ...formData, emotion: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Happy">Happy</SelectItem>
                    <SelectItem value="Sad">Sad</SelectItem>
                    <SelectItem value="Angry">Angry</SelectItem>
                    <SelectItem value="Excited">Excited</SelectItem>
                    <SelectItem value="Calm">Calm</SelectItem>
                    <SelectItem value="Anxious">Anxious</SelectItem>
                    <SelectItem value="Inspired">Inspired</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 