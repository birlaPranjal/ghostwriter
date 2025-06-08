"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Ghost, Sparkles, Zap, Users } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <header className="border-b border-purple-900/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <Ghost className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
          </motion.div>

          <div className="flex items-center space-x-4">
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
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 ghost-glow">
            Write Like a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">Human</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 ghost-glow">
            Think Like an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">AI</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4 ghost-glow">Supernatural Writing Powers</h3>
          <p className="text-gray-300 text-lg">Harness AI to create content that haunts your readers' minds</p>
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
              <Card className="p-6 bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 hover:border-purple-600/50 transition-all duration-300">
                <feature.icon className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold mb-2 text-center ghost-glow">{feature.title}</h4>
                <p className="text-gray-300 text-center">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Ghostwriter AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
