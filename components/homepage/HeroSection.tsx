import React from "react"
import { motion } from "framer-motion"
import { Ghost, Sparkles, Zap, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onGhostCursorToggle: () => void
  isGhostCursorActive: boolean
  onThemeToggle: () => void
  theme: string
  session: any
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGhostCursorToggle, isGhostCursorActive, onThemeToggle, theme, session }) => (
  <>
    {/* Header */}
    <header className="border-b border-purple-900/20 backdrop-blur-sm relative z-20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
          <Ghost className="h-8 w-8 text-purple-400 float-element" />
          <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
        </motion.div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="hover:bg-purple-900/20"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {/* Ghost cursor toggle */}
          <Button
            variant={isGhostCursorActive ? "default" : "outline"}
            size="icon"
            onClick={onGhostCursorToggle}
            className={
              isGhostCursorActive
                ? "bg-cyan-400/80 text-white border-cyan-400 hover:bg-cyan-400/90 fire-glow"
                : "border-purple-600 text-purple-300 hover:bg-purple-900/20"
            }
            aria-label={isGhostCursorActive ? "Deactivate ghost cursor" : "Activate ghost cursor"}
            title={isGhostCursorActive ? "Deactivate ghost cursor (Esc)" : "Activate ghost cursor"}
          >
            <Ghost className="h-5 w-5" />
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
  </>
) 