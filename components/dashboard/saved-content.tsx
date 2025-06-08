"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Edit, Trash2 } from "lucide-react"

interface SavedContentItem {
  id: string
  title: string
  content: string
  type: string
  tone: string
  style: string
  emotion: string
  createdAt: string
}

export function SavedContent() {
  const [savedContent, setSavedContent] = useState<SavedContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedContent()
  }, [])

  const fetchSavedContent = async () => {
    try {
      const response = await fetch("/api/getContent")
      const data = await response.json()
      setSavedContent(data.content || [])
    } catch (error) {
      console.error("Error fetching saved content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: "DELETE" })
      setSavedContent((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting content:", error)
    }
  }

  const handleTTS = async (text: string) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("Error generating TTS:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="shimmer h-32 rounded-lg bg-purple-950/20"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {savedContent.length === 0 ? (
        <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">No saved content yet. Start generating some content!</p>
          </CardContent>
        </Card>
      ) : (
        savedContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 hover:border-purple-600/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="ghost-glow">{item.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="border-purple-600 text-purple-300">
                      {item.type}
                    </Badge>
                    <Badge variant="outline" className="border-purple-600 text-purple-300">
                      {item.tone}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-3">{item.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTTS(item.content)}
                        className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="border-red-600 text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
