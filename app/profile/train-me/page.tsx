"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Twitter, Linkedin, Save, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

interface TrainingData {
  previousPosts: string[]
  writingStyle: string
  preferredTones: string[]
  favoriteTopics: string[]
  targetAudience: string
  socialMediaHistory: {
    platform: string
    content: string
    engagement: number
    date: string
  }[]
}

export default function TrainMePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [trainingData, setTrainingData] = useState<TrainingData>({
    previousPosts: [],
    writingStyle: "",
    preferredTones: [],
    favoriteTopics: [],
    targetAudience: "",
    socialMediaHistory: []
  })
  const [newPost, setNewPost] = useState("")
  const [platform, setPlatform] = useState<"twitter" | "linkedin">("twitter")
  const [topic, setTopic] = useState("")
  const [generatedPost, setGeneratedPost] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      const fetchTrainingData = async () => {
        try {
          setLoading(true)
          const response = await fetch("/api/profile")
          if (!response.ok) {
            throw new Error("Failed to fetch profile")
          }
          const data = await response.json()
          setTrainingData({
            previousPosts: data.previousPosts || [],
            writingStyle: data.writingStyle || "",
            preferredTones: data.preferredTones || [],
            favoriteTopics: data.favoriteTopics || [],
            targetAudience: data.targetAudience || "",
            socialMediaHistory: data.socialMediaHistory || []
          })
        } catch (error) {
          console.error("Error fetching training data:", error)
          toast({
            title: "Error",
            description: "Failed to load training data. Please try again.",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }

      fetchTrainingData()
    }
  }, [status, router, toast])

  const handleAddPost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Error",
        description: "Please enter a post before adding.",
        variant: "destructive"
      })
      return
    }

    setTrainingData(prev => ({
      ...prev,
      previousPosts: [...prev.previousPosts, newPost.trim()]
    }))
    setNewPost("")
  }

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for the post.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          trainingData
        })
      })

      if (!response.ok) {
        throw new Error("Failed to generate post")
      }

      const data = await response.json()
      setGeneratedPost(data.post)

      // Save to training history
      setTrainingData(prev => ({
        ...prev,
        socialMediaHistory: [
          ...prev.socialMediaHistory,
          {
            platform,
            content: data.post,
            engagement: Math.floor(Math.random() * 100),
            date: new Date().toISOString()
          }
        ]
      }))

      toast({
        title: "Success",
        description: "Post generated successfully!",
      })
    } catch (error) {
      console.error("Error generating post:", error)
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTrainingData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trainingData)
      })

      if (!response.ok) {
        throw new Error("Failed to save training data")
      }

      toast({
        title: "Success",
        description: "Training data saved successfully!",
      })
    } catch (error) {
      console.error("Error saving training data:", error)
      toast({
        title: "Error",
        description: "Failed to save training data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <TopBar />
            <main className="p-6">
              <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold ghost-glow">Train My Writing Style</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Previous Posts</CardTitle>
                    <p className="text-sm text-gray-400">
                      Add your previous posts to help train the AI
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPost">Add New Post</Label>
                      <Textarea
                        id="newPost"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Paste your previous post here..."
                        className="min-h-[100px] bg-black/20 border-purple-900/30"
                      />
                      <Button
                        onClick={handleAddPost}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Add Post
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-purple-400">Added Posts</h3>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {trainingData.previousPosts.map((post, index) => (
                          <div
                            key={index}
                            className="p-3 bg-black/20 rounded-lg text-sm text-gray-300"
                          >
                            {post}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Generate Social Media Post</CardTitle>
                    <p className="text-sm text-gray-400">
                      Create a post based on your writing style
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={platform}
                        onValueChange={(value: "twitter" | "linkedin") => setPlatform(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic for your post..."
                        className="bg-black/20 border-purple-900/30"
                      />
                    </div>

                    <Button
                      onClick={handleGeneratePost}
                      disabled={loading || !topic.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          {platform === "twitter" ? (
                            <Twitter className="mr-2 h-4 w-4" />
                          ) : (
                            <Linkedin className="mr-2 h-4 w-4" />
                          )}
                          Generate {platform === "twitter" ? "Tweet" : "LinkedIn Post"}
                        </>
                      )}
                    </Button>

                    {generatedPost && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-purple-400">Generated Post</h3>
                        <div className="p-3 bg-black/20 rounded-lg text-sm text-gray-300">
                          {generatedPost}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-purple-950/20 border-purple-900/30">
                <CardHeader>
                  <CardTitle>Training History</CardTitle>
                  <p className="text-sm text-gray-400">
                    Track your generated posts and their performance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingData.socialMediaHistory.map((post, index) => (
                      <Card key={index} className="bg-black/20 border-purple-900/30">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {post.platform === "twitter" ? (
                                  <Twitter className="h-4 w-4" />
                                ) : (
                                  <Linkedin className="h-4 w-4" />
                                )}
                                {post.platform === "twitter" ? "Tweet" : "LinkedIn Post"}
                              </CardTitle>
                              <p className="text-sm text-gray-400">
                                {new Date(post.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-sm text-purple-400">
                              Engagement: {post.engagement}%
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300">{post.content}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveTrainingData}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Training Data
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
} 