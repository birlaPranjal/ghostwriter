"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Ghost,
  Send,
  X,
  MessageCircle,
  Sparkles,
  Lightbulb,
  BookOpen,
  Loader2,
  Minimize2,
  RefreshCw,
} from "lucide-react"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface GhostChatbotProps {
  className?: string
}

export function GhostChatbot({ className = "" }: GhostChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm your AI assistant. I can help you with:\n\n📝 Writing tips and techniques\n💡 Content ideas\n🎨 Choosing tone and style\n📚 Grammar and storytelling\n🎤 Speech writing\n\nWhat would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    { text: "Writing tips for beginners", icon: BookOpen },
    { text: "Content ideas for social media", icon: Lightbulb },
    { text: "Grammar and style guide", icon: Sparkles },
    { text: "SEO writing techniques", icon: Ghost },
  ]

  const getGhostResponse = async (userMessage: string): Promise<string> => {
    try {
      setError(null)
      console.log("Sending message to API:", userMessage)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-8), // Send last 8 messages for context
        }),
      })

      console.log("API response status:", response.status)

      const data = await response.json()
      console.log("API response data:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data.response || "I'm not sure how to respond to that. Could you try rephrasing your question?"
    } catch (error) {
      console.error("Error getting response:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      return "I'm having trouble connecting right now. Please check your internet connection and try again."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await getGhostResponse(currentInput)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Something went wrong! Please try asking your question again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (text: string) => {
    setInputValue(text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Chat cleared! How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ])
    setError(null)
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Toggle Button - Much Larger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="relative h-24 w-24 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-red-600 hover:from-purple-700 hover:via-purple-600 hover:to-red-700 fire-glow shadow-2xl border-2 border-purple-400/30"
            >
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Ghost className="h-16 w-16 text-white drop-shadow-2xl" />
              </motion.div>

              {/* Enhanced notification pulse */}
              <motion.div
                className="absolute -top-3 -right-3 h-8 w-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white"
                animate={{
                  scale: [1, 1.4, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0.8)",
                    "0 0 0 15px rgba(239, 68, 68, 0)",
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <MessageCircle className="h-4 w-4 text-white" />
              </motion.div>

              {/* Enhanced floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background:
                      i % 3 === 0
                        ? "radial-gradient(circle, rgba(168, 85, 247, 0.9), transparent)"
                        : i % 3 === 1
                          ? "radial-gradient(circle, rgba(34, 211, 238, 0.7), transparent)"
                          : "radial-gradient(circle, rgba(236, 72, 153, 0.8), transparent)",
                    top: `${10 + i * 10}%`,
                    left: `${10 + i * 12}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    opacity: [0, 1, 0],
                    scale: [0.2, 1.5, 0.2],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Multiple glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-400/40"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/30"
                animate={{
                  scale: [1.2, 1.8, 1.2],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window - Improved Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className={`absolute bottom-0 right-0 mb-2 ${isMinimized ? "w-80 h-16" : "w-[450px] h-[650px]"}`}
          >
            <Card className="h-full bg-gradient-to-br from-purple-950/98 to-black/98 border-2 border-purple-500/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-purple-800/50">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Ghost className="h-12 w-12 text-purple-300 ghost-glow" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-purple-100 ghost-glow text-xl">AI Assistant</h3>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <p className="text-sm text-purple-300 font-medium">
                        {error ? "Connection Issue" : "Online & Ready"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="hover:bg-purple-800/30 text-purple-300"
                    title="Clear Chat"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="hover:bg-purple-800/30 text-purple-300"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-purple-800/30 text-purple-300"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-900/20 border-b border-red-500/30">
                      <p className="text-red-300 text-sm">⚠️ {error}</p>
                    </div>
                  )}

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <div className="h-[420px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                              message.isUser
                                ? "bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-purple-500/25"
                                : "bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/30 text-purple-50 shadow-purple-900/25"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.text}</p>
                            <p className="text-xs opacity-70 mt-2 font-normal">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Enhanced typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/30 p-4 rounded-2xl shadow-lg">
                            <div className="flex items-center space-x-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              >
                                <Ghost className="h-5 w-5 text-purple-400" />
                              </motion.div>
                              <div className="flex space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2.5 h-2.5 bg-purple-400 rounded-full"
                                    animate={{
                                      scale: [1, 1.8, 1],
                                      opacity: [0.4, 1, 0.4],
                                    }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Number.POSITIVE_INFINITY,
                                      delay: i * 0.2,
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-purple-300 font-medium">Thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies with Search */}
                    {messages.length <= 1 && (
                      <div className="px-4 pb-3 border-t border-purple-500/20">
                        <p className="text-sm text-purple-300 mb-3 font-semibold">✨ Try asking me:</p>

                        {/* Search Bar for Quick Queries */}
                        <div className="mb-4">
                          <div className="relative">
                            <Input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Search or type your question..."
                              className="bg-purple-900/40 border-purple-500/50 focus:border-purple-400 text-purple-100 placeholder-purple-400 text-sm font-medium rounded-xl pl-10 pr-12"
                              disabled={isTyping}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Sparkles className="h-4 w-4 text-purple-400" />
                            </div>
                            <Button
                              onClick={handleSendMessage}
                              disabled={!inputValue.trim() || isTyping}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 disabled:opacity-50 rounded-lg"
                            >
                              {isTyping ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>

                        {/* Quick Reply Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          {quickReplies.map((reply, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleQuickReply(reply.text)}
                              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl text-xs text-purple-200 hover:from-purple-800/40 hover:to-purple-700/40 transition-all duration-200 hover:border-purple-400/50 hover:shadow-lg"
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <reply.icon className="h-4 w-4 text-purple-400" />
                              <span className="font-medium">{reply.text}</span>
                            </motion.button>
                          ))}
                        </div>

                        <p className="text-xs text-purple-400/60 mt-3 text-center">
                          💡 Use the search bar above or click on quick suggestions
                        </p>
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-purple-800/20">
                      <div className="flex space-x-3">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything..."
                          className="bg-purple-900/30 border-purple-500/40 focus:border-purple-400 text-purple-100 placeholder-purple-400 text-sm font-medium rounded-xl"
                          disabled={isTyping}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isTyping}
                          className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 disabled:opacity-50 min-w-[48px] rounded-xl shadow-lg"
                        >
                          {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                      </div>
                      <p className="text-xs text-purple-400/80 mt-2 text-center font-medium">
                        Powered by GPT-4 • Press Enter to send
                      </p>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
