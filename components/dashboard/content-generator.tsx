"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Volume2, Save, Copy } from "lucide-react"

interface ContentGeneratorProps {
  type: "blog" | "story" | "speech"
}

export function ContentGenerator({ type }: ContentGeneratorProps) {
  const [title, setTitle] = useState("")
  const [tone, setTone] = useState("")
  const [style, setStyle] = useState("")
  const [emotion, setEmotion] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleGenerate = async () => {
    if (!title || !tone || !style || !emotion) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: title,
          type,
          tone,
          style,
          emotion
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate content")
      }

      const data = await response.json()

      if (data.content) {
        setIsTyping(true)
        await typeWriter(data.content)
        setIsTyping(false)
      }
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const typeWriter = async (text: string) => {
    setGeneratedContent("")
    for (let i = 0; i <= text.length; i++) {
      setGeneratedContent(text.slice(0, i))
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  }

  const handleSave = async () => {
    if (!generatedContent) return

    try {
      await fetch("/api/saveContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: generatedContent,
          type,
          tone,
          style,
          emotion,
        }),
      })
    } catch (error) {
      console.error("Error saving content:", error)
    }
  }

  const handleTTS = async () => {
    if (!generatedContent) return

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: generatedContent }),
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("Error generating TTS:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
        <CardHeader>
          <CardTitle className="ghost-glow capitalize">{type} Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter your ${type} title...`}
              className="bg-black/50 border-purple-900/30 focus:border-purple-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-black/50 border-purple-900/30">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-900/30">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                  <SelectItem value="mysterious">Mysterious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-black/50 border-purple-900/30">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-900/30">
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="emotion">Emotion</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="bg-black/50 border-purple-900/30">
                  <SelectValue placeholder="Select emotion" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-900/30">
                  <SelectItem value="inspiring">Inspiring</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="exciting">Exciting</SelectItem>
                  <SelectItem value="melancholic">Melancholic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !title || !tone || !style || !emotion}
              className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow"
            >
              {isGenerating ? (
                <div className="shimmer">Generating...</div>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate {type}
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {generatedContent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
            <CardHeader>
              <CardTitle className="ghost-glow">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 p-4 rounded-lg border border-purple-900/30 mb-4">
                <p className={`text-gray-300 whitespace-pre-wrap ${isTyping ? "typing-cursor" : ""}`}>
                  {generatedContent}
                </p>
              </div>

              <div className="flex space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleTTS}
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Play Voice
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                    variant="outline"
                    className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
