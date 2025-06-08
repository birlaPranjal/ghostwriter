"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

const questions = [
  {
    id: 1,
    question: "How do you prefer to start your writing?",
    options: [
      "With a clear outline and structure",
      "By free-writing and letting ideas flow",
      "With research and data collection",
      "By discussing with others first"
    ]
  },
  {
    id: 2,
    question: "What's your ideal writing environment?",
    options: [
      "A quiet, distraction-free space",
      "A cozy café with background noise",
      "Outdoors in nature",
      "Anywhere with good music"
    ]
  },
  {
    id: 3,
    question: "How do you handle writer's block?",
    options: [
      "Take a break and come back later",
      "Force through it with writing exercises",
      "Switch to a different project",
      "Seek inspiration from others' work"
    ]
  },
  {
    id: 4,
    question: "What's your primary goal when writing?",
    options: [
      "To inform and educate",
      "To entertain and engage",
      "To persuade and influence",
      "To express and create"
    ]
  }
]

export default function PersonalityQuizPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      analyzeAnswers()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const analyzeAnswers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/analyze-personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      })

      if (!res.ok) throw new Error("Analysis failed")

      const data = await res.json()
      setAnalysis(data.analysis)
      
      toast({
        title: "Analysis Complete",
        description: "Your writing personality has been analyzed successfully!"
      })
    } catch (error) {
      console.error("Error analyzing answers:", error)
      toast({
        title: "Error",
        description: "Failed to analyze your answers. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

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
                <h1 className="text-3xl font-bold ghost-glow">Writing Personality Quiz</h1>
              </div>

              {!analysis ? (
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                    <p className="text-sm text-gray-400">
                      {questions[currentQuestion].question}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={answers[currentQuestion] || ""}
                      onValueChange={handleAnswer}
                      className="space-y-4"
                    >
                      {questions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                            className="text-purple-600"
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="text-gray-300 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion] || loading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : currentQuestion === questions.length - 1 ? (
                          "Finish"
                        ) : (
                          "Next"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-purple-950/20 border-purple-900/30">
                  <CardHeader>
                    <CardTitle>Your Writing Personality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAnalysis(null)
                        setCurrentQuestion(0)
                        setAnswers([])
                      }}
                      className="mt-4"
                    >
                      Retake Quiz
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
} 