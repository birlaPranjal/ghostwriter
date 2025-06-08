import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface QuizQuestion {
  id: number
  question: string
  options: {
    value: string
    label: string
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you prefer to approach writing?",
    options: [
      { value: "structured", label: "I like clear structure and organization" },
      { value: "creative", label: "I prefer creative freedom and flow" },
      { value: "analytical", label: "I focus on facts and analysis" },
      { value: "emotional", label: "I emphasize emotional connection" }
    ]
  },
  {
    id: 2,
    question: "What's your ideal writing environment?",
    options: [
      { value: "quiet", label: "Quiet and peaceful" },
      { value: "dynamic", label: "Dynamic and energetic" },
      { value: "collaborative", label: "Collaborative and interactive" },
      { value: "flexible", label: "Flexible and adaptable" }
    ]
  },
  {
    id: 3,
    question: "How do you handle feedback on your writing?",
    options: [
      { value: "constructive", label: "I welcome constructive criticism" },
      { value: "selective", label: "I'm selective about feedback" },
      { value: "defensive", label: "I tend to be defensive" },
      { value: "collaborative", label: "I use it for collaboration" }
    ]
  },
  {
    id: 4,
    question: "What's your primary writing goal?",
    options: [
      { value: "inform", label: "To inform and educate" },
      { value: "entertain", label: "To entertain and engage" },
      { value: "persuade", label: "To persuade and influence" },
      { value: "express", label: "To express and connect" }
    ]
  }
]

interface PersonalityQuizProps {
  onAnalysisComplete: (analysis: string) => void
}

export function PersonalityQuiz({ onAnalysisComplete }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      analyzeAnswers()
    }
  }

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1)
  }

  const analyzeAnswers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      
      // Save the analysis to the profile
      const saveResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalityAnalysis: data.analysis })
      })

      if (!saveResponse.ok) throw new Error("Failed to save analysis")

      onAnalysisComplete(data.analysis)
      
      toast({
        title: "Analysis Complete",
        description: "Your writing personality has been analyzed and saved successfully!"
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

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <Card className="bg-purple-950/20 border-purple-900/30">
      <CardHeader>
        <CardTitle>Writing Personality Quiz</CardTitle>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-purple-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {quizQuestions[currentQuestion].question}
            </h3>
            <RadioGroup
              value={answers[quizQuestions[currentQuestion].id]}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {quizQuestions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || loading}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[quizQuestions[currentQuestion].id] || loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : currentQuestion === quizQuestions.length - 1 ? (
                "Complete"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 