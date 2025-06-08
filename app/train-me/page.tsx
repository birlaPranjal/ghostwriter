"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, BookOpen, Target, Brain } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface TrainingData {
  writingStyle: string
  experienceLevel: string
  preferredLength: string
  writingGoals: string
  writingMetrics?: {
    optimisticTone: { score: number }
    reflectiveQuality: { score: number }
    motivationalImpact: { score: number }
    poeticElements: { score: number }
    conversationalStyle: { score: number }
  }
}

export default function TrainMePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null)

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
            throw new Error("Failed to fetch training data")
          }
          const data = await response.json()
          setTrainingData(data)
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
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Training Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Writing Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Style</p>
                        <p className="font-medium">{trainingData?.writingStyle || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Experience</p>
                        <p className="font-medium">{trainingData?.experienceLevel || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Preferred Length</p>
                        <p className="font-medium">{trainingData?.preferredLength || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Goals</p>
                        <p className="font-medium line-clamp-1">{trainingData?.writingGoals || "Not set"}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/profile")}
                      className="w-full"
                    >
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Writing Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {trainingData?.writingMetrics ? (
                      <>
                        {Object.entries(trainingData.writingMetrics).map(([key, metric]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-purple-400">{metric.score}%</span>
                            </div>
                            <Progress value={metric.score} className="h-2" />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => router.push("/profile/writing-test")}
                          className="w-full"
                        >
                          Take Writing Test
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 mb-4">No writing metrics available</p>
                        <Button
                          onClick={() => router.push("/profile/writing-test")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Start Writing Test
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-purple-950/20 border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Training Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Training Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="h-2 flex-1" />
                        <span className="text-sm text-purple-400">75%</span>
                      </div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Samples Analyzed</p>
                      <p className="text-2xl font-bold text-purple-400">24</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Next Training</p>
                      <p className="text-2xl font-bold text-purple-400">2 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
} 