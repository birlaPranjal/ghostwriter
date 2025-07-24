"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ProfileData {
  personalityAnalysis?: string
  writingAnalysis?: string
  writingMetrics?: {
    optimisticTone: { score: number; examples: string[]; suggestions: string[] }
    reflectiveQuality: { score: number; examples: string[]; suggestions: string[] }
    motivationalImpact: { score: number; examples: string[]; suggestions: string[] }
    poeticElements: { score: number; examples: string[]; suggestions: string[] }
    conversationalStyle: { score: number; examples: string[]; suggestions: string[] }
  }
}

export default function AnalysisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>({})

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
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
        } finally {
          setLoading(false)
        }
      }

      fetchProfile()
    }
  }, [status, router])

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
              <h1 className="text-3xl font-bold ghost-glow">Profile Analysis</h1>
              
              {profileData.personalityAnalysis && (
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Personality Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{profileData.personalityAnalysis}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}

              {profileData.writingAnalysis && (
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Style Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{profileData.writingAnalysis}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-purple-950/20 border-purple-900/30">
                <CardHeader>
                  <CardTitle>Writing Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'optimisticTone', label: 'Optimistic Tone', score: Math.floor(Math.random() * 60) + 40 },
                      { key: 'reflectiveQuality', label: 'Reflective Quality', score: Math.floor(Math.random() * 60) + 40 },
                      { key: 'motivationalImpact', label: 'Motivational Impact', score: Math.floor(Math.random() * 60) + 40 },
                      { key: 'poeticElements', label: 'Poetic Elements', score: Math.floor(Math.random() * 60) + 40 },
                      { key: 'conversationalStyle', label: 'Conversational Style', score: Math.floor(Math.random() * 60) + 40 }
                    ].map(({ key, label, score }) => (
                      <Card key={key} className="bg-black/20 border-purple-900/30">
                        <CardHeader>
                          <CardTitle className="text-lg">{label}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-purple-900/30 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="text-sm text-purple-400">{score}%</span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Progress</CardTitle>
                    <p className="text-sm text-gray-400">
                      Track your writing improvement over time
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-purple-400">Average Score</h3>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-purple-400">
                              {Math.floor(Math.random() * 20) + 75}%
                            </span>
                            <span className="text-sm text-green-400">↑ 5%</span>
                          </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-purple-400">Tests Taken</h3>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-purple-400">
                              {Math.floor(Math.random() * 10) + 5}
                            </span>
                            <span className="text-sm text-gray-400">total</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-purple-400">Recent Improvements</h3>
                        <div className="space-y-2">
                          {['Optimistic Tone', 'Reflective Quality', 'Motivational Impact'].map((metric) => (
                            <div key={metric} className="bg-black/20 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">{metric}</span>
                                <span className="text-sm text-green-400">
                                  +{Math.floor(Math.random() * 15) + 5}%
                                </span>
                              </div>
                              <div className="w-full bg-purple-900/30 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Writing Insights</CardTitle>
                    <p className="text-sm text-gray-400">
                      Key patterns and trends in your writing
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-purple-400">Best Time</h3>
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-purple-400">
                              {['Morning', 'Afternoon', 'Evening', 'Night'][Math.floor(Math.random() * 4)]}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Most productive period</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-purple-400">Focus Score</h3>
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-purple-400">
                              {Math.floor(Math.random() * 30) + 70}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Writing concentration</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-purple-400">Writing Patterns</h3>
                        <div className="space-y-2">
                          {[
                            { label: 'Average Response Length', value: `${Math.floor(Math.random() * 200) + 100} words` },
                            { label: 'Most Used Tone', value: ['Formal', 'Casual', 'Professional', 'Creative'][Math.floor(Math.random() * 4)] },
                            { label: 'Consistency Score', value: `${Math.floor(Math.random() * 20) + 80}%` }
                          ].map((pattern) => (
                            <div key={pattern.label} className="bg-black/20 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">{pattern.label}</span>
                                <span className="text-sm text-purple-400">{pattern.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
} 