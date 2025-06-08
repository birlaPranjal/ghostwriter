"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

interface AnalysisData {
  writingMetrics: {
    optimisticTone: {
      score: number
      examples: string[]
      suggestions: string[]
    }
    reflectiveQuality: {
      score: number
      examples: string[]
      suggestions: string[]
    }
    motivationalImpact: {
      score: number
      examples: string[]
      suggestions: string[]
    }
    poeticElements: {
      score: number
      examples: string[]
      suggestions: string[]
    }
    conversationalStyle: {
      score: number
      examples: string[]
      suggestions: string[]
    }
  }
  styleAnalysis: {
    tone: string
    voice: string
    structure: string
    strengths: string[]
    areasForImprovement: string[]
  }
  contentAnalysis: {
    clarity: string
    engagement: string
    coherence: string
    keyThemes: string[]
    emotionalImpact: string
  }
  recommendations: {
    styleEnhancements: string[]
    structuralImprovements: string[]
    contentSuggestions: string[]
    practiceExercises: string[]
  }
}

const writingPrompts = [
  "Write about a moment that changed your perspective on life.",
  "Describe your ideal day from start to finish.",
  "What does success mean to you?",
  "Share a lesson you learned from a failure.",
  "Write about something you're passionate about.",
  "Describe a place that makes you feel at peace.",
  "What would you tell your younger self?",
  "Write about a challenge you overcame.",
  "Describe your perfect weekend getaway.",
  "What inspires you to write?"
]

export default function WritingTestPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * writingPrompts.length)
    setPrompt(writingPrompts[randomIndex])
  }

  const analyzeWriting = async () => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Please write something before analyzing.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/analyze-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          response
        })
      })

      if (!res.ok) {
        throw new Error("Failed to analyze writing")
      }

      const data = await res.json()
      
      // Adjust scores to be above 40%
      const adjustedMetrics = {
        optimisticTone: {
          ...data.metrics.optimisticTone,
          score: Math.max(40, data.metrics.optimisticTone.score + Math.floor(Math.random() * 30))
        },
        reflectiveQuality: {
          ...data.metrics.reflectiveQuality,
          score: Math.max(40, data.metrics.reflectiveQuality.score + Math.floor(Math.random() * 30))
        },
        motivationalImpact: {
          ...data.metrics.motivationalImpact,
          score: Math.max(40, data.metrics.motivationalImpact.score + Math.floor(Math.random() * 30))
        },
        poeticElements: {
          ...data.metrics.poeticElements,
          score: Math.max(40, data.metrics.poeticElements.score + Math.floor(Math.random() * 30))
        },
        conversationalStyle: {
          ...data.metrics.conversationalStyle,
          score: Math.max(40, data.metrics.conversationalStyle.score + Math.floor(Math.random() * 30))
        }
      }

      // Update the analysis data with adjusted metrics
      const adjustedAnalysisData = {
        ...data.analysisData,
        writingMetrics: adjustedMetrics
      }

      setAnalysis(adjustedAnalysisData)
      
      // Save the analysis to the profile with adjusted metrics
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          writingAnalysis: data.analysis,
          writingMetrics: adjustedMetrics,
          lastWritingPrompt: prompt,
          lastWritingResponse: response,
          writingHistory: [{
            prompt,
            response,
            analysis: data.analysis,
            metrics: {
              optimisticTone: adjustedMetrics.optimisticTone.score,
              reflectiveQuality: adjustedMetrics.reflectiveQuality.score,
              motivationalImpact: adjustedMetrics.motivationalImpact.score,
              poeticElements: adjustedMetrics.poeticElements.score,
              conversationalStyle: adjustedMetrics.conversationalStyle.score
            },
            date: new Date().toISOString()
          }]
        })
      })

      if (!profileRes.ok) {
        throw new Error("Failed to save analysis to profile")
      }
      
      toast({
        title: "Success",
        description: "Your writing has been analyzed and saved successfully.",
      })

      // Redirect to analysis page after a short delay
      setTimeout(() => {
        router.push("/profile/analysis")
      }, 2000)
    } catch (error) {
      console.error("Error analyzing writing:", error)
      toast({
        title: "Error",
        description: "Failed to analyze writing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
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
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/profile")}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Profile
                </Button>
                <h1 className="text-3xl font-bold ghost-glow">Writing Style Test</h1>
              </div>

              <Card className="bg-purple-950/20 border-purple-900/30">
                <CardHeader>
                  <CardTitle>Writing Style Analysis</CardTitle>
                  <p className="text-sm text-gray-400">
                    Write a response to the prompt below. Your writing will be analyzed to understand your style and provide personalized recommendations.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Writing Prompt</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generatePrompt}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        New Prompt
                      </Button>
                    </div>
                    <p className="text-gray-300 italic">{prompt || "Click 'New Prompt' to get started"}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Your Response</h3>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Write your response here..."
                      className="min-h-[200px] bg-black/20 border-purple-900/30"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={analyzeWriting}
                      disabled={!prompt || !response.trim() || loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Analyze Writing Style
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {analysis && (
                <div className="mt-6 space-y-6">
                  <Card className="bg-purple-950/20 border-purple-900/30">
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-purple-400">Writing Metrics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {Object.entries(analysis.writingMetrics).map(([key, metric]) => (
                          <Card key={key} className="bg-black/20 border-purple-900/30">
                            <CardHeader>
                                  <CardTitle className="text-base capitalize">
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
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-purple-400">Style Analysis</h3>
                          <div className="mt-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-purple-300">Tone & Voice</h4>
                              <p className="text-gray-300">{analysis.styleAnalysis.tone}</p>
                              <p className="text-gray-300">{analysis.styleAnalysis.voice}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-purple-300">Structure</h4>
                              <p className="text-gray-300">{analysis.styleAnalysis.structure}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-purple-400">Content Analysis</h3>
                          <div className="mt-4 space-y-4">
                                <div>
                              <h4 className="text-sm font-medium text-purple-300">Key Themes</h4>
                              <ul className="mt-2 space-y-1">
                                {analysis.contentAnalysis.keyThemes.map((theme, i) => (
                                  <li key={i} className="text-gray-300">{theme}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                              <h4 className="text-sm font-medium text-purple-300">Impact</h4>
                              <p className="text-gray-300">{analysis.contentAnalysis.emotionalImpact}</p>
                                </div>
                              </div>
                      </div>

                        <div>
                          <h3 className="text-lg font-medium text-purple-400">Recommendations</h3>
                          <div className="mt-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-purple-300">Style Enhancements</h4>
                          <ul className="mt-2 space-y-1">
                                {analysis.recommendations.styleEnhancements.map((enhancement, i) => (
                                  <li key={i} className="text-gray-300">{enhancement}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                              <h4 className="text-sm font-medium text-purple-300">Content Suggestions</h4>
                          <ul className="mt-2 space-y-1">
                                {analysis.recommendations.contentSuggestions.map((suggestion, i) => (
                                  <li key={i} className="text-gray-300">{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                              <h4 className="text-sm font-medium text-purple-300">Practice Exercises</h4>
                          <ul className="mt-2 space-y-1">
                                {analysis.recommendations.practiceExercises.map((exercise, i) => (
                                  <li key={i} className="text-gray-300">{exercise}</li>
                            ))}
                          </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
} 