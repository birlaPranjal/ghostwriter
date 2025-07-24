import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Ghost } from "lucide-react"

interface GhostCursorProps {
  active: boolean
  onDeactivate: () => void
}

export const GhostCursor: React.FC<GhostCursorProps> = ({ active, onDeactivate }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const trailLength = 4

  useEffect(() => {
    if (!active) return
    const handleMouse = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
      setTrail((prev) => {
        const next = [...prev, { x: e.clientX, y: e.clientY }]
        return next.slice(-trailLength)
      })
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDeactivate()
    }
    document.addEventListener("mousemove", handleMouse)
    document.addEventListener("keydown", handleKey)
    document.body.style.cursor = "none"
    return () => {
      document.removeEventListener("mousemove", handleMouse)
      document.removeEventListener("keydown", handleKey)
      document.body.style.cursor = "auto"
    }
  }, [active, onDeactivate])

  if (!active) return null
  return (
    <>
      {/* Main ghost */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{ left: mouse.x - 30, top: mouse.y - 30 }}
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Ghost className="h-16 w-16 text-cyan-400 drop-shadow-2xl" />
        {/* Glowing rings */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-cyan-400/30 blur-lg" />
        <motion.div animate={{ opacity: [0.3, 0.8, 0.3], scale: [1.2, 1.8, 1.2] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
        <motion.div animate={{ opacity: [0.2, 0.6, 0.2], scale: [1.5, 2.2, 1.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="absolute inset-0 rounded-full bg-red-500/15 blur-2xl" />
        {/* Trailing particles */}
        {trail.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-sm"
            style={{
              transform: `translate(-50%, -50%) translate(${(pos.x - mouse.x) / 2}px, ${(pos.y - mouse.y) / 2}px` + ` scale(${1 - i * 0.2})`,
              opacity: 0.5 - i * 0.1,
            }}
            animate={{ opacity: [0.5 - i * 0.1, 0.2], scale: [1 - i * 0.2, 0.7 - i * 0.1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </>
  )
} 