"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Share2, Download, ExternalLink, VolumeX, Copy, Check, Edit2, BookOpen, Clock, FileText } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getMultipleImages } from "@/lib/pexels"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BlogDisplayProps {
  title: string
  content: string
  tone: string
  style: string
  emotion: string
  imageUrl?: string | null
  onTTS?: () => void
  authorId: string
  blogId: string
  authorName?: string
  contentLength?: 'brief' | 'descriptive' | 'detailed'
}

export function BlogDisplay({ 
  title, 
  content, 
  tone, 
  style, 
  emotion, 
  imageUrl,
  onTTS,
  authorId,
  blogId,
  authorName = "Anonymous",
  contentLength = 'descriptive'
}: BlogDisplayProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [sectionImages, setSectionImages] = useState<string[]>([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const isAuthor = session?.user?.id === authorId

  // Calculate reading time based on content length
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  const readingTime = calculateReadingTime(content)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis)
      const baseUrl = window.location.origin
      const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-')
      const shareableUrl = `${baseUrl}/blog/${authorSlug}/${blogId}`
      setShareUrl(shareableUrl)
    }
  }, [authorName, blogId])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getMultipleImages(title, 3)
        setSectionImages(images)
      } catch (error) {
        console.error('Error fetching images:', error)
        setSectionImages([imageUrl || ''])
      }
    }
    fetchImages()
  }, [title, imageUrl])

  const handleTTS = () => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(content)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      tone === 'professional' ? voice.name.includes('Male') : 
      tone === 'casual' ? voice.name.includes('Female') : 
      voice.name.includes('Male')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/content/${blogId}/edit`)
  }

  const formatContent = (text: string) => {
    const sections = text.split('\n\n')
    
    return sections.map((section, index) => {
      if (section.startsWith('# ')) {
        return (
          <h1 key={index} className="text-5xl font-bold mb-8 text-purple-300 tracking-tight">
            {section.slice(2)}
          </h1>
        )
      } else if (section.startsWith('## ')) {
        return (
          <h2 key={index} className="text-3xl font-semibold mb-6 text-purple-200 tracking-tight">
            {section.slice(3)}
          </h2>
        )
      } else if (section.startsWith('### ')) {
        return (
          <h3 key={index} className="text-2xl font-medium mb-4 text-purple-100 tracking-tight">
            {section.slice(4)}
          </h3>
        )
      }
      
      return (
        <p key={index} className="mb-6 text-gray-300 leading-relaxed text-lg">
          {section}
        </p>
      )
    })
  }

  const contentSections = content.split('\n\n')
  const imagePositions = [0, Math.floor(contentSections.length / 2), contentSections.length - 1]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-10/12 mx-auto min-h-screen "
      >
        <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 overflow-hidden min-h-screen">
          {imageUrl && (
            <div className="relative w-full h-[70vh]">
              <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isImageLoading ? 'opacity-100' : 'opacity-0'}`} />
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12">
                <div className="flex items-center justify-between">
                  <div className="max-w-4xl">
                    <CardTitle className="text-7xl font-bold ghost-glow text-white mb-8 leading-tight">
                      {title}
                    </CardTitle>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">By</span>
                        <span className="text-white font-medium text-lg">{authorName}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {readingTime} min read
                        </Badge>
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {contentLength}
                        </Badge>
                      </div>
                      {isAuthor && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
                          onClick={handleEdit}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600">
                        {tone}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600">
                        {style}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-600">
                        {emotion}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <CardContent className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-9">
                <article className="prose prose-invert prose-purple max-w-none">
                  {contentSections.map((section, index) => (
                    <div key={index} className="mb-16">
                      {formatContent(section)}
                      {imagePositions.includes(index) && sectionImages[index] && (
                        <div className="relative w-full h-[600px] my-12 rounded-2xl overflow-hidden shadow-2xl">
                          <Image
                            src={sectionImages[index]}
                            alt={`${title} - Section ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </article>
              </div>
              
              <div className="lg:col-span-3">
                <div className="sticky top-8 space-y-6">
                  <Card className="bg-purple-950/20 border-purple-900/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-purple-300 mb-6">Article Actions</h3>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full border-purple-600 text-purple-300 hover:bg-purple-900/20 h-12"
                          onClick={handleTTS}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="mr-2 h-5 w-5" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2 className="mr-2 h-5 w-5" />
                              Listen
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-purple-600 text-purple-300 hover:bg-purple-900/20 h-12"
                          onClick={handleShare}
                        >
                          <Share2 className="mr-2 h-5 w-5" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-purple-600 text-purple-300 hover:bg-purple-900/20 h-12"
                          onClick={() => {
                            const blob = new Blob([content], { type: 'text/markdown' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-purple-600 text-purple-300 hover:bg-purple-900/20 h-12"
                          onClick={() => window.print()}
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Print
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md bg-black/95 border-purple-900/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-300">Share Article</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this article with others using the link below
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              readOnly
              value={shareUrl}
              className="flex-1 bg-purple-950/20 border-purple-900/30 text-purple-300"
            />
            <Button
              size="icon"
              variant="outline"
              className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
              onClick={handleCopyLink}
            >
              {isCopied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 