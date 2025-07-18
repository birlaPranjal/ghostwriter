import React from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"

interface CreationTypeCardProps {
  icon: keyof typeof LucideIcons
  title: string
  description: string
  example: string
}

export const CreationTypeCard: React.FC<CreationTypeCardProps> = ({ icon, title, description, example }) => {
  const Icon = LucideIcons[icon] || LucideIcons.FileText
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-red-500/50 transition-all duration-300 group-hover:fire-glow h-[280px] flex flex-col">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <Icon className="h-12 w-12 text-purple-400 mb-4 mx-auto group-hover:text-red-400 transition-colors" />
        </motion.div>
        <h4 className="text-xl font-semibold mb-2 text-center ghost-glow">{title}</h4>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        <div className="text-center mt-auto">
          <span className="text-sm text-purple-300 italic">"{example}"</span>
        </div>
      </Card>
    </motion.div>
  )
} 