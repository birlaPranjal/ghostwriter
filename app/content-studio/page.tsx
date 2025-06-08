"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { ContentGenerator } from "@/components/dashboard/content-generator"
import { FileText, BookOpen, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { VoiceInput } from "@/components/ui/voice-input"

interface ContentData {
  title: string
  description: string
  keywords: string
  tone: string
  length: string
  format: string
}

export default function ContentStudioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [contentData, setContentData] = useState<ContentData>({
    title: "",
    description: "",
    keywords: "",
    tone: "",
    length: "",
    format: ""
  })

  const handleVoiceInput = (field: keyof ContentData) => (text: string) => {
    setContentData(prev => ({
      ...prev,
      [field]: text
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData)
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "Content generated successfully!",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Content Studio</h1>

              <Tabs value="blogs" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-purple-950/20 border border-purple-900/30">
                  <TabsTrigger
                    value="blogs"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Blogs
                  </TabsTrigger>
                  <TabsTrigger
                    value="stories"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Stories
                  </TabsTrigger>
                  <TabsTrigger
                    value="speeches"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Speeches
                  </TabsTrigger>
                </TabsList>

                <div className="grid gap-6">
                  <TabsContent value="blogs" className="m-0">
                    <ContentGenerator type="blog" />
                  </TabsContent>

                  <TabsContent value="stories" className="m-0">
                    <ContentGenerator type="story" />
                  </TabsContent>

                  <TabsContent value="speeches" className="m-0">
                    <ContentGenerator type="speech" />
                  </TabsContent>
                </div>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Content Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <div className="flex gap-2">
                          <Input
                            id="title"
                            value={contentData.title}
                            onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                            placeholder="Enter content title..."
                            className="bg-black/20 border-purple-900/30"
                          />
                          <VoiceInput onTranscript={handleVoiceInput("title")} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <div className="flex gap-2">
                          <Textarea
                            id="description"
                            value={contentData.description}
                            onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                            placeholder="Enter content description..."
                            className="min-h-[100px] bg-black/20 border-purple-900/30"
                          />
                          <VoiceInput onTranscript={handleVoiceInput("description")} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <div className="flex gap-2">
                          <Input
                            id="keywords"
                            value={contentData.keywords}
                            onChange={(e) => setContentData({ ...contentData, keywords: e.target.value })}
                            placeholder="Enter keywords (comma-separated)..."
                            className="bg-black/20 border-purple-900/30"
                          />
                          <VoiceInput onTranscript={handleVoiceInput("keywords")} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tone">Tone</Label>
                          <Select
                            value={contentData.tone}
                            onValueChange={(value) => setContentData({ ...contentData, tone: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="humorous">Humorous</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="length">Length</Label>
                          <Select
                            value={contentData.length}
                            onValueChange={(value) => setContentData({ ...contentData, length: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="long">Long</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="format">Format</Label>
                          <Select
                            value={contentData.format}
                            onValueChange={(value) => setContentData({ ...contentData, format: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blog">Blog Post</SelectItem>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="submit"
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
                        <Save className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
