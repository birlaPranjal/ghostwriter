"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Ghost,
  Sparkles,
  Zap,
  Users,
  FileText,
  Mic,
  BookOpen,
  Settings,
  Eye,
  Save,
  Copy,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function HomePage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState("")
  const ghostsRef = useRef<HTMLDivElement[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isGhostCursor, setIsGhostCursor] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // Add scroll tracking state
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mouse tracking for ghost cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (isGhostCursor) {
      document.addEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "none" // Hide default cursor
    } else {
      document.body.style.cursor = "auto" // Show default cursor
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "auto"
    }
  }, [isGhostCursor])

  // Handle escape key to exit ghost cursor mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isGhostCursor) {
        setIsGhostCursor(false)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isGhostCursor])

  const pricingPlans = [
    {
      name: "Apprentice",
      price: "$9",
      period: "/month",
      features: ["100 generations/month", "Basic voices", "Standard support"],
      current: true,
    },
    {
      name: "Ghostwriter",
      price: "$29",
      period: "/month",
      features: ["Unlimited generations", "Premium voices", "Priority support", "Advanced styles"],
      popular: true,
    },
    {
      name: "Phantom",
      price: "$99",
      period: "/month",
      features: ["Everything in Ghostwriter", "Custom voice cloning", "API access", "White-label option"],
    },
  ]

  const creationTypes = [
    {
      icon: FileText,
      title: "Blog Posts",
      description: "Craft engaging articles that captivate your audience",
      example: "The Art of Letting Go",
    },
    {
      icon: Mic,
      title: "Speeches",
      description: "Deliver powerful words that move hearts and minds",
      example: "Leadership in the Digital Age",
    },
    {
      icon: BookOpen,
      title: "Short Stories",
      description: "Weave tales that transport readers to other worlds",
      example: "Whispers in the Moonlight",
    },
  ]

  const workflowSteps = [
    {
      icon: Settings,
      title: "Choose Type",
      description: "Select your content format",
    },
    {
      icon: Eye,
      title: "Set Tone",
      description: "Define style and emotion",
    },
    {
      icon: Sparkles,
      title: "Generate Content",
      description: "AI creates your masterpiece",
    },
    {
      icon: Save,
      title: "Save/Edit/Listen",
      description: "Perfect and preserve your work",
    },
  ]

  const features = [
    {
      title: "Tone Matching",
      description: "AI adapts to your unique voice and style preferences",
    },
    {
      title: "Real Voice",
      description: "ElevenLabs integration for lifelike speech synthesis",
    },
    {
      title: "Personalization",
      description: "Learns from your writing patterns and improves over time",
    },
    {
      title: "Auto Save",
      description: "Never lose your creative breakthroughs again",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      quote: "Ghostwriter AI transformed my writing process. It's like having a creative partner who never sleeps.",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Public Speaker",
      quote: "The speech generation is incredible. My presentations have never been more engaging.",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
    },
    {
      name: "Emily Watson",
      role: "Novelist",
      quote: "From writer's block to bestseller. This AI understands storytelling like no other.",
      avatar: "/placeholder.svg?height=40&width=40&text=EW",
    },
  ]

  const apiFeatures = ["GPT-4 Integration", "ElevenLabs TTS", "JWT Authentication", "MongoDB Storage"]

  const codeSnippet = `curl -X POST https://api.ghostwriter-ai.com/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "blog",
    "title": "The Future of AI",
    "tone": "professional",
    "style": "informative"
  }'`

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email subscription
    console.log("Email submitted:", email)
    setEmail("")
  }

  const handleGhostClick = () => {
    setIsGhostCursor(!isGhostCursor)
  }

  // Initialize floating ghosts with enhanced animations
  useEffect(() => {
    if (typeof window === "undefined") return

    // Wait for hydration to complete
    const timer = setTimeout(() => {
      const createFloatingGhosts = () => {
        const numGhosts = 8 // Reduced from 15
        const container = containerRef.current
        if (!container) return

        // Clear existing ghosts
        ghostsRef.current.forEach((ghost) => {
          if (ghost && ghost.parentNode) {
            ghost.parentNode.removeChild(ghost)
          }
        })
        ghostsRef.current = []

        for (let i = 0; i < numGhosts; i++) {
          const ghost = document.createElement("div")
          const animationType = i % 6 // 6 different animation types
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const randomDelay = Math.random() * 10

          let animationClass = ""
          switch (animationType) {
            case 0:
              animationClass = "full-scroll-ghost"
              break
            case 1:
              animationClass = "horizontal-scroll-ghost"
              break
            case 2:
              animationClass = "diagonal-scroll-ghost"
              break
            case 3:
              animationClass = "circular-scroll-ghost"
              break
            case 4:
              animationClass = "zigzag-scroll-ghost"
              break
            case 5:
              animationClass = "wave-scroll-ghost"
              break
            default:
              animationClass = ""
          }

          ghost.className = `floating-ghost fixed pointer-events-none ${animationClass}`

          ghost.style.cssText = `
  left: ${randomX}%;
  top: ${randomY}%;
  animation-duration: ${25 + Math.random() * 15}s;
  animation-delay: ${randomDelay}s;
  transform: scale(${0.6 + Math.random() * 0.8});
  --scroll-offset: ${scrollY}px;
  --random-x: ${randomX}%;
  --random-y: ${randomY}%;
`

          ghost.innerHTML = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.686 2 6 4.686 6 8v8c0 1.105.895 2 2 2h1l1-2h4l1 2h1c1.105 0 2-.895 2-2V8c0-3.314-2.686-6-6-6z" fill="currentColor"/>
    <circle cx="9" cy="9" r="1.2" fill="rgba(255,255,255,0.8)"/>
    <circle cx="15" cy="9" r="1.2" fill="rgba(255,255,255,0.8)"/>
    <path d="M8 13c0 1 1 2 2 2s2-1 2-2M14 13c0 1 1 2 2 2s2-1 2-2" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none"/>
  </svg>
`

          container.appendChild(ghost)
          ghostsRef.current.push(ghost)
        }
      }

      createFloatingGhosts()

      // Recreate ghosts on window resize
      const handleResize = () => {
        createFloatingGhosts()
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        ghostsRef.current.forEach((ghost) => {
          if (ghost && ghost.parentNode) {
            ghost.parentNode.removeChild(ghost)
          }
        })
      }
    }, 2000) // Wait 2 seconds after component mount to ensure hydration is complete

    return () => {
      clearTimeout(timer)
      ghostsRef.current.forEach((ghost) => {
        if (ghost && ghost.parentNode) {
          ghost.parentNode.removeChild(ghost)
        }
      })
    }
  }, [])

  // Add scroll event listener with smooth updates
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update scroll offset for existing ghosts with optimized performance
  useEffect(() => {
    const updateGhosts = () => {
      ghostsRef.current.forEach((ghost, index) => {
        if (ghost) {
          ghost.style.setProperty("--scroll-offset", `${scrollY}px`)
        }
      })
    }

    // Use requestAnimationFrame for smooth updates
    const animationId = requestAnimationFrame(updateGhosts)
    return () => cancelAnimationFrame(animationId)
  }, [scrollY])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background transition-colors duration-300 relative overflow-hidden"
    >
      {/* Ghost Cursor */}
      {isGhostCursor && (
        <motion.div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: mousePosition.x - 30,
            top: mousePosition.y - 30,
          }}
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Ghost
            className="h-16 w-16 text-cyan-400 drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 20px #00ffff) drop-shadow(0 0 40px #8b5cf6) drop-shadow(0 0 60px #ef4444)",
              textShadow: "0 0 20px #00ffff, 0 0 40px #8b5cf6, 0 0 60px #ef4444",
            }}
          />

          {/* Multiple glowing rings */}
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-cyan-400/30 blur-lg"
          />

          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1.2, 1.8, 1.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
          />

          <motion.div
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1.5, 2.2, 1.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="absolute inset-0 rounded-full bg-red-500/15 blur-2xl"
          />

          {/* Trailing particles */}
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              x: [0, -20, -40],
              y: [0, Math.sin(Date.now() * 0.01) * 10, Math.sin(Date.now() * 0.01) * 20],
            }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-sm"
          />

          <motion.div
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.3, 0.8, 0.3],
              x: [0, -15, -30],
              y: [0, Math.sin(Date.now() * 0.015) * 8, Math.sin(Date.now() * 0.015) * 15],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.1,
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full blur-sm"
          />

          <motion.div
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.2, 0.6, 0.2],
              x: [0, -10, -20],
              y: [0, Math.sin(Date.now() * 0.02) * 6, Math.sin(Date.now() * 0.02) * 12],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-400 rounded-full blur-sm"
          />
        </motion.div>
      )}

      {/* Header */}
      <header className="border-b border-purple-900/20 backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Ghost className="h-8 w-8 text-purple-400 float-element" />
            <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-purple-900/20"
            >
              {isMounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
            {session ? (
              <Link href="/dashboard">
                <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/20">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/20">
                    Sign In
                  </Button>
                </Link>
                <Link href="/demo">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 fire-glow">
                      Try Demo
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 ghost-glow">
            Write Like a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">Human</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 ghost-glow">
            Think Like an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">AI</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Unleash the power of AI to create compelling blogs, captivating stories, and powerful speeches. Your
            ghostwriter in the digital realm.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow text-lg px-8 py-4"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </motion.div>
            </Link>
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-900/20 text-lg px-8 py-4"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Try Demo
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* What You Can Create Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">What You Can Create</h3>
          <p className="text-muted-foreground text-lg">Bring your ideas to life with supernatural precision</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {creationTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-red-500/50 transition-all duration-300 group-hover:fire-glow h-[280px] flex flex-col">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <type.icon className="h-12 w-12 text-purple-400 mb-4 mx-auto group-hover:text-red-400 transition-colors" />
                </motion.div>
                <h4 className="text-xl font-semibold mb-2 text-center ghost-glow">{type.title}</h4>
                <p className="text-muted-foreground text-center mb-4">{type.description}</p>
                <div className="text-center mt-auto">
                  <span className="text-sm text-purple-300 italic">"{type.example}"</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">How It Works</h3>
          <p className="text-muted-foreground text-lg">Four simple steps to supernatural content</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 fire-glow">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2 ghost-glow">{step.title}</h4>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ghostwriting Advantage Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl font-bold mb-6 ghost-glow">The Ghostwriting Advantage</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Experience the supernatural power of AI that understands not just what you want to say, but how you want
              to say it.
            </p>
            <p className="text-muted-foreground">
              Our advanced algorithms learn from your writing style, adapt to your voice, and create content that feels
              authentically yours. It's like having a ghostwriter who knows your thoughts before you do.
            </p>
            <motion.div className="mt-8 flex justify-center">
              <motion.div
                onClick={handleGhostClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={
                  !isGhostCursor
                    ? {
                        y: [0, -15, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
                className={`relative cursor-pointer ${isGhostCursor ? "opacity-50" : ""}`}
              >
                <Ghost className="h-20 w-20 text-purple-400 ghost-glow drop-shadow-lg" />
                <motion.div
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl pointer-events-none"
                />
                {!isGhostCursor && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-300 whitespace-nowrap"
                  >
                    Click me! 👆
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="p-4 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-red-500/50 transition-all duration-300 group-hover:fire-glow">
                  <h4 className="font-semibold mb-2 ghost-glow">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">Loved by Creators</h3>
          <p className="text-muted-foreground text-lg">Join thousands of writers who've found their voice</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-600/50 transition-all duration-300 relative overflow-hidden h-[200px] flex flex-col">
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute top-2 right-2"
                >
                  <Ghost className="h-6 w-6 text-purple-400" />
                </motion.div>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold ghost-glow">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">{testimonial.quote}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join the Ghost Club Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto p-8 bg-card/50 backdrop-blur-sm border-purple-900/30">
            <h3 className="text-3xl font-bold mb-4 ghost-glow">Join the Ghost Club</h3>
            <p className="text-muted-foreground mb-6">Summon Updates from the Beyond</p>
            <form onSubmit={handleEmailSubmit} className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-purple-900/30 focus:border-purple-600"
                required
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow"
                >
                  👻 Subscribe
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </section>

      {/* Developer API Preview Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">Developer API Preview</h3>
          <p className="text-muted-foreground text-lg">Integrate Ghostwriter AI into your applications</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-6 bg-black/90 border-purple-900/30 font-mono text-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-400">$ API Request</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(codeSnippet)}
                  className="hover:bg-purple-900/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <pre className="text-green-300 whitespace-pre-wrap">{codeSnippet}</pre>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h4 className="text-2xl font-bold mb-6 ghost-glow">API Features</h4>
            <div className="space-y-4">
              {apiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <Zap className="h-5 w-5 text-purple-400 mr-3" />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow">
                  Get API Access
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">Supernatural Writing Powers</h3>
          <p className="text-muted-foreground text-lg">Harness AI to create content that haunts your readers' minds</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Ghost,
              title: "AI-Powered Generation",
              description: "Generate blogs, stories, and speeches with supernatural intelligence",
            },
            {
              icon: Sparkles,
              title: "Voice Synthesis",
              description: "Bring your content to life with ElevenLabs text-to-speech",
            },
            {
              icon: Users,
              title: "Multiple Styles",
              description: "Adapt tone, emotion, and style to match your vision",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-600/50 transition-all duration-300">
                <feature.icon className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2 text-center ghost-glow">{feature.title}</h4>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">Subscription Plans</h3>
          <p className="text-muted-foreground text-lg">Choose the perfect plan for your ghostwriting needs</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className={`relative p-6 bg-card/50 backdrop-blur-sm ${
                  plan.popular
                    ? "border-purple-600 fire-glow"
                    : plan.current
                      ? "border-green-600"
                      : "border-purple-900/30"
                } hover:border-purple-600/50 transition-all duration-300 h-[380px] flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-red-600">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600">
                      <Crown className="mr-1 h-3 w-3" />
                      Current Plan
                    </Badge>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold mb-2 ghost-glow">{plan.name}</h4>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-muted-foreground">
                      <Zap className="mr-3 h-4 w-4 text-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                  <Button
                    className={`w-full ${
                      plan.current
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow"
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-purple-900/20 bg-gradient-to-b from-background to-purple-950/10 relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Ghost className="h-8 w-8 text-purple-400 float-element" />
                <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Unleash the supernatural power of AI to create compelling content that haunts your readers' minds.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold ghost-glow">Product</h4>
              <ul className="space-y-2">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "API Documentation", href: "#api" },
                  { name: "Integrations", href: "#integrations" },
                  { name: "Templates", href: "#templates" },
                  { name: "Changelog", href: "#changelog" },
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: "#a855f7" }}
                      className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold ghost-glow">Company</h4>
              <ul className="space-y-2">
                {[
                  { name: "About Us", href: "#about" },
                  { name: "Blog", href: "#blog" },
                  { name: "Careers", href: "#careers" },
                  { name: "Press Kit", href: "#press" },
                  { name: "Contact", href: "#contact" },
                  { name: "Partners", href: "#partners" },
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: "#a855f7" }}
                      className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold ghost-glow">Support</h4>
              <ul className="space-y-2">
                {[
                  { name: "Help Center", href: "#help" },
                  { name: "Community", href: "#community" },
                  { name: "Status Page", href: "#status" },
                  { name: "Privacy Policy", href: "#privacy" },
                  { name: "Terms of Service", href: "#terms" },
                  { name: "Cookie Policy", href: "#cookies" },
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: "#a855f7" }}
                      className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-purple-900/20 pt-8">
            {/* Developed by Section - Full Width */}
            <div className="flex flex-col items-center justify-center mb-8 w-full">
              <div className="flex items-center justify-center space-x-16 text-5xl md:text-7xl w-full">
                <span className="text-muted-foreground font-medium text-5xl md:text-7xl">Developed by</span>

                <span className="text-5xl md:text-7xl font-bold ghost-glow bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                  Int Main()
                </span>

                {/* Large Animated Ghost Icon */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <Ghost className="h-28 w-28 md:h-32 md:w-32 text-purple-400 ghost-glow" />

                  {/* Glow effect around the ghost */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-purple-400/20 blur-lg pointer-events-none"
                  />
                </motion.div>
              </div>
            </div>

            {/* Copyright and other info - Single Line */}
            <div className="flex flex-col items-center justify-center pt-6 border-t border-purple-900/10">
              <div className="flex items-center justify-center space-x-4 text-center">
                <p className="text-muted-foreground text-sm">&copy; 2024 Ghostwriter AI. All rights reserved.</p>
                <span className="text-muted-foreground text-sm">||</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">All systems operational</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 mt-2">
                <span className="text-xs text-muted-foreground">Powered by</span>
                <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                  OpenAI GPT-4
                </Badge>
                <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                  ElevenLabs
                </Badge>
              </div>
            </div>
          </div>

          {/* Floating Ghost in Footer */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-4 right-4 pointer-events-none"
          >
            <Ghost className="h-8 w-8 text-purple-400/50" />
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
