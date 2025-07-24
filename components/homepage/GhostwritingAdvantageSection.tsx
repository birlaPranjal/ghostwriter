import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Ghost } from "lucide-react"

interface Feature {
  title: string
  description: string
}

interface GhostwritingAdvantageSectionProps {
  features: Feature[]
  onGhostCursorToggle: () => void
  isGhostCursorActive: boolean
}

export const GhostwritingAdvantageSection: React.FC<GhostwritingAdvantageSectionProps> = ({ features, onGhostCursorToggle, isGhostCursorActive }) => (
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
            onClick={onGhostCursorToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={
              !isGhostCursorActive
                ? {
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
            className={`relative cursor-pointer ${isGhostCursorActive ? "opacity-50" : ""}`}
            title={isGhostCursorActive ? "Deactivate ghost cursor (Esc)" : "Activate ghost cursor"}
          >
            <Ghost className="h-20 w-20 text-purple-400 ghost-glow drop-shadow-lg" />
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl pointer-events-none"
            />
            {!isGhostCursorActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
) 