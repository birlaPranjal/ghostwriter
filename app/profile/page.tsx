"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, PenLine } from "lucide-react"
import { PersonalityQuiz } from "@/components/profile/personality-quiz"
import { WritingTest } from "@/components/profile/writing-test"
import ReactMarkdown from "react-markdown"

interface ProfileData {
  writingStyle: string
  preferredTones: string[]
  favoriteTopics: string[]
  targetAudience: string
  writingGoals: string
  experienceLevel: string
  preferredLength: string
  referenceAuthors: string
  personalityAnalysis?: string
  writingAnalysis?: string
  lastWritingPrompt?: string
  lastWritingResponse?: string
  writingMetrics?: {
    optimisticTone: { score: number; examples: string[]; suggestions: string[] }
    reflectiveQuality: { score: number; examples: string[]; suggestions: string[] }
    motivationalImpact: { score: number; examples: string[]; suggestions: string[] }
    poeticElements: { score: number; examples: string[]; suggestions: string[] }
    conversationalStyle: { score: number; examples: string[]; suggestions: string[] }
  }
  writingHistory?: Array<{
    prompt: string
    response: string
    analysis: string
    metrics: {
      optimisticTone: number
      reflectiveQuality: number
      motivationalImpact: number
      poeticElements: number
      conversationalStyle: number
    }
    date: string
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showWritingTest, setShowWritingTest] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    writingStyle: "",
    preferredTones: [],
    favoriteTopics: [],
    targetAudience: "",
    writingGoals: "",
    experienceLevel: "",
    preferredLength: "",
    referenceAuthors: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      // router.push("/login")
      return
    }

    if (status === "authenticated") {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    }
  }, [status, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const updatedData = await response.json()
      setProfileData(updatedData)
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAnalysisComplete = (analysis: string) => {
    setProfileData(prev => ({
      ...prev,
      personalityAnalysis: analysis
    }))
    setShowQuiz(false)
  }

  const handleWritingAnalysisComplete = (analysis: string) => {
    setProfileData(prev => ({
      ...prev,
      writingAnalysis: analysis
    }))
    setShowWritingTest(false)
  }

  if (!session) return null

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
            >
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Profile Settings</h1>
              <p className="text-gray-400 mb-8">
                Customize your writing preferences to get more personalized AI-generated content.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Style Analysis</CardTitle>
                    <p className="text-sm text-gray-400">
                      Take a writing test to analyze your style and get personalized recommendations.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {profileData.writingAnalysis ? (
                      <div className="space-y-4">
                        <div className="prose prose-invert max-w-none line-clamp-3">
                          <ReactMarkdown>{profileData.writingAnalysis}</ReactMarkdown>
                        </div>
                        {profileData.writingMetrics && (
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {Object.entries(profileData.writingMetrics).map(([key, metric]) => (
                              <div key={key} className="bg-black/20 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm text-purple-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <span className="text-sm text-purple-400">{metric.score}%</span>
                                </div>
                                <div className="w-full bg-purple-900/30 rounded-full h-1.5">
                                  <div
                                    className="bg-purple-600 h-1.5 rounded-full"
                                    style={{ width: `${metric.score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push("/profile/writing-test")}
                        >
                          Take Another Test
                        </Button>
                          <Button
                            variant="default"
                            onClick={() => router.push("/profile/analysis")}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            View Full Analysis
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => router.push("/profile/writing-test")}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Take Writing Test
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Personality Quiz</CardTitle>
                    <p className="text-sm text-gray-400">
                      Discover your writing personality and get tailored advice.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {profileData.personalityAnalysis ? (
                      <div className="space-y-4">
                        <div className="prose prose-invert max-w-none line-clamp-3">
                          <ReactMarkdown>{profileData.personalityAnalysis}</ReactMarkdown>
                        </div>
                        <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push("/profile/personality-quiz")}
                        >
                          Retake Quiz
                        </Button>
                          <Button
                            variant="default"
                            onClick={() => router.push("/profile/analysis")}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            View Full Analysis
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => router.push("/profile/personality-quiz")}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Take Personality Quiz
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Add Writing Stats Section */}
              <Card className="bg-purple-950/20 border-purple-900/30 mb-8">
                <CardHeader>
                  <CardTitle>Writing Statistics</CardTitle>
                  <p className="text-sm text-gray-400">
                    Your writing journey at a glance
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-black/20 border-purple-900/30">
                      <CardHeader>
                        <CardTitle className="text-lg">Writing Streak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-purple-400">
                            {Math.floor(Math.random() * 30) + 1}
                          </span>
                          <span className="text-sm text-gray-400">days</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Keep up the good work!</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 border-purple-900/30">
                      <CardHeader>
                        <CardTitle className="text-lg">Total Words</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-purple-400">
                            {(Math.random() * 10000).toFixed(0)}
                          </span>
                          <span className="text-sm text-gray-400">words</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Written so far</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/20 border-purple-900/30">
                      <CardHeader>
                        <CardTitle className="text-lg">Writing Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-purple-400">
                            {Math.floor(Math.random() * 30) + 70}%
                          </span>
                          <span className="text-sm text-gray-400">improvement</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Since last month</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {profileData.writingMetrics && (
                <Card className="bg-purple-950/20 border-purple-900/30 mb-8">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Writing Style Metrics</CardTitle>
                    <p className="text-sm text-gray-400">
                        Overview of your writing style metrics
                    </p>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => router.push("/profile/analysis")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      View Detailed Metrics
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(profileData.writingMetrics).map(([key, metric]) => (
                        <Card key={key} className="bg-black/20 border-purple-900/30">
                          <CardHeader>
                            <CardTitle className="text-lg capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-purple-900/30 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${metric.score}%` }}
                                />
                              </div>
                              <span className="text-sm text-purple-400">{metric.score}%</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {metric.examples && metric.examples.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-purple-400">Examples</h4>
                                  <ul className="text-sm text-gray-400 mt-1">
                                    {metric.examples.map((example: string, i: number) => (
                                      <li key={i} className="truncate">{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {metric.suggestions && metric.suggestions.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-purple-400">Suggestions</h4>
                                  <ul className="text-sm text-gray-400 mt-1">
                                    {metric.suggestions.map((suggestion: string, i: number) => (
                                      <li key={i} className="truncate">{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profileData.writingHistory && profileData.writingHistory.length > 0 && (
                <Card className="bg-purple-950/20 border-purple-900/30 mb-8">
                  <CardHeader>
                    <CardTitle>Writing History</CardTitle>
                    <p className="text-sm text-gray-400">
                      Track your writing style evolution over time
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.writingHistory.map((entry, index) => (
                        <Card key={index} className="bg-black/20 border-purple-900/30">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Prompt: {entry.prompt}</h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(entry.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {Object.entries(entry.metrics).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-400"
                                    title={`${key}: ${value}%`}
                                  >
                                    {value}%
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-medium text-purple-400">Response</h4>
                                <p className="text-sm text-gray-400 line-clamp-3">{entry.response}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement detailed view modal
                                  console.log("View details:", entry)
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Style & Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="writingStyle">Writing Style</Label>
                        <Select
                          value={profileData.writingStyle}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, writingStyle: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your writing style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal & Academic</SelectItem>
                            <SelectItem value="conversational">Conversational & Friendly</SelectItem>
                            <SelectItem value="professional">Professional & Business</SelectItem>
                            <SelectItem value="creative">Creative & Expressive</SelectItem>
                            <SelectItem value="technical">Technical & Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="experienceLevel">Experience Level</Label>
                        <Select
                          value={profileData.experienceLevel}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, experienceLevel: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="preferredLength">Preferred Content Length</Label>
                        <Select
                          value={profileData.preferredLength}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, preferredLength: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brief">Brief (300-500 words)</SelectItem>
                            <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                            <SelectItem value="detailed">Detailed (1500-2000 words)</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive (2000+ words)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Content Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Input
                          id="targetAudience"
                          value={profileData.targetAudience || ""}
                          onChange={(e) =>
                            setProfileData({ ...profileData, targetAudience: e.target.value })
                          }
                          placeholder="e.g., Tech-savvy professionals, College students"
                        />
                      </div>

                      <div>
                        <Label htmlFor="favoriteTopics">Favorite Topics (comma-separated)</Label>
                        <Input
                          id="favoriteTopics"
                          value={Array.isArray(profileData.favoriteTopics) ? profileData.favoriteTopics.join(", ") : ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              favoriteTopics: e.target.value.split(",").map((topic) => topic.trim()).filter(Boolean)
                            })
                          }
                          placeholder="e.g., Technology, Personal Development, Science"
                        />
                      </div>

                      <div>
                        <Label htmlFor="referenceAuthors">Favorite Authors/Writers</Label>
                        <Textarea
                          id="referenceAuthors"
                          value={profileData.referenceAuthors || ""}
                          onChange={(e) =>
                            setProfileData({ ...profileData, referenceAuthors: e.target.value })
                          }
                          placeholder="List authors whose writing style you admire"
                          className="h-24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="writingGoals">Writing Goals</Label>
                        <Textarea
                          id="writingGoals"
                          value={profileData.writingGoals || ""}
                          onChange={(e) =>
                            setProfileData({ ...profileData, writingGoals: e.target.value })
                          }
                          placeholder="What do you hope to achieve with your writing?"
                          className="h-24"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
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
