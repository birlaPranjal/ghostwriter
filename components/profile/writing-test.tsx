import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

interface WritingTestProps {
  onAnalysisComplete: (analysis: string) => void
}

export function WritingTest({ onAnalysisComplete }: WritingTestProps) {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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
        body: JSON.stringify({ prompt, response })
      })

      if (!res.ok) throw new Error("Analysis failed")

      const data = await res.json()

      // Save the analysis to the profile
      const saveResponse = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          writingAnalysis: data.analysis,
          writingMetrics: data.metrics,
          lastWritingPrompt: prompt,
          lastWritingResponse: response
        })
      })

      if (!saveResponse.ok) throw new Error("Failed to save analysis")

      onAnalysisComplete(data.analysis)
      
      toast({
        title: "Analysis Complete",
        description: "Your writing style has been analyzed and saved successfully!"
      })
    } catch (error) {
      console.error("Error analyzing writing:", error)
      toast({
        title: "Error",
        description: "Failed to analyze your writing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-purple-950/20 border-purple-900/30">
      <CardHeader>
        <CardTitle>Writing Style Analysis</CardTitle>
        <p className="text-sm text-gray-400">
          Write a response to the prompt below. We'll analyze your writing style and provide insights.
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
  )
} 