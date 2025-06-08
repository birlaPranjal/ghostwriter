"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { FileText, BookOpen, Mic, Share2, Download, Eye, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { VoiceInput } from "@/components/ui/voice-input"
import ReactMarkdown from "react-markdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ContentData {
  title: string
  description: string
  tone: string
  length: string
  format: string
  type: string
}

interface Project {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  status: "draft" | "published"
}

export default function ContentStudioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [contentData, setContentData] = useState<ContentData>({
    title: "",
    description: "",
    tone: "",
    length: "",
    format: "",
    type: "blog"
  })
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects()
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      })
    }
  }

  const handleVoiceInput = (field: keyof ContentData) => (text: string) => {
    setContentData(prev => ({
      ...prev,
      [field]: text
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedContent("")

    try {
      const prompt = getPromptTemplate(contentData)

      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentData.type,
          title: contentData.title,
          prompt: contentData.description,
          parameters: {
            tone: contentData.tone,
            length: contentData.length,
            format: contentData.format
          }
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      
      toast({
        title: "Success",
        description: "Content generated successfully!",
      })

      // Redirect to the content display page
      router.push(`/content-studio/${contentData.type}/${data._id}`)
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

  const saveProject = async (projectData: Partial<Project>) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) throw new Error("Failed to save project")
      
      await fetchProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      })
    }
  }

  const publishProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST"
      })

      if (!response.ok) throw new Error("Failed to publish project")
      
      await fetchProjects()
      toast({
        title: "Success",
        description: "Project published successfully!",
      })
    } catch (error) {
      console.error("Error publishing project:", error)
      toast({
        title: "Error",
        description: "Failed to publish project",
        variant: "destructive"
      })
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete project")
      
      await fetchProjects()
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      })
    }
  }

  const getPromptTemplate = (data: ContentData) => {
    const basePrompt = `Write a ${data.type} with the following details:
Title: ${data.title}
Description: ${data.description}
Tone: ${data.tone}
Length: ${data.length}
Format: ${data.format}

Please generate high-quality content that matches these specifications.`

    return basePrompt
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive"
      })
    }
  }

  const downloadContent = (content: string, title: string) => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareContent = async (content: string, title: string) => {
    try {
      await navigator.share({
        title: title,
        text: content.substring(0, 100) + "...",
        url: window.location.href
      })
    } catch (error) {
      console.error("Error sharing content:", error)
      toast({
        title: "Error",
        description: "Failed to share content",
        variant: "destructive"
      })
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tabs defaultValue="blogs" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-purple-950/20 border border-purple-900/30">
                      <TabsTrigger
                        value="blogs"
                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                        onClick={() => setContentData(prev => ({ ...prev, type: "blog" }))}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Blogs
                      </TabsTrigger>
                      <TabsTrigger
                        value="stories"
                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                        onClick={() => setContentData(prev => ({ ...prev, type: "story" }))}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Stories
                      </TabsTrigger>
                      <TabsTrigger
                        value="speeches"
                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                        onClick={() => setContentData(prev => ({ ...prev, type: "speech" }))}
                      >
                        <Mic className="mr-2 h-4 w-4" />
                        Speeches
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="blogs" className="m-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Card className="bg-purple-950/20 border-purple-900/30">
                        <CardHeader>
                          <CardTitle>Blog Content Details</CardTitle>
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
                                  placeholder="Enter blog title..."
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
                                  placeholder="Enter blog description..."
                                  className="min-h-[100px] bg-black/20 border-purple-900/30"
                                />
                                <VoiceInput onTranscript={handleVoiceInput("description")} />
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
                              Generate Blog
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    </TabsContent>

                    <TabsContent value="stories" className="m-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Card className="bg-purple-950/20 border-purple-900/30">
                        <CardHeader>
                          <CardTitle>Story Content Details</CardTitle>
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
                                  placeholder="Enter story title..."
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
                                  placeholder="Enter story description..."
                                  className="min-h-[100px] bg-black/20 border-purple-900/30"
                                />
                                <VoiceInput onTranscript={handleVoiceInput("description")} />
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
                                    <SelectItem value="short-story">Short Story</SelectItem>
                                    <SelectItem value="novel">Novel</SelectItem>
                                    <SelectItem value="poem">Poem</SelectItem>
                                    <SelectItem value="script">Script</SelectItem>
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
                              Generate Story
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    </TabsContent>

                    <TabsContent value="speeches" className="m-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Card className="bg-purple-950/20 border-purple-900/30">
                        <CardHeader>
                          <CardTitle>Speech Content Details</CardTitle>
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
                                  placeholder="Enter speech title..."
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
                                  placeholder="Enter speech description..."
                                  className="min-h-[100px] bg-black/20 border-purple-900/30"
                                />
                                <VoiceInput onTranscript={handleVoiceInput("description")} />
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
                                    <SelectItem value="keynote">Keynote</SelectItem>
                                    <SelectItem value="presentation">Presentation</SelectItem>
                                    <SelectItem value="toast">Toast</SelectItem>
                                    <SelectItem value="debate">Debate</SelectItem>
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
                              Generate Speech
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    </TabsContent>

                  {generatedContent && (
                    <Card className="bg-purple-950/20 border-purple-900/30 mt-6">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Content</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="flex items-center gap-2"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadContent(generatedContent, contentData.title)}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => shareContent(generatedContent, contentData.title)}
                            className="flex items-center gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{generatedContent}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Tabs>
                </div>

                <div className="space-y-6">
                  <Card className="bg-purple-950/20 border-purple-900/30">
                    <CardHeader>
                      <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id} className="bg-black/20 border-purple-900/30">
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{project.title}</h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedProject(project)
                                    setIsEditing(true)
                                  }}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  {project.status === "draft" && (
                                    <DropdownMenuItem onClick={() => publishProject(project.id)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Publish
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => downloadContent(project.content, project.title)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => shareContent(project.content, project.title)}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => deleteProject(project.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
