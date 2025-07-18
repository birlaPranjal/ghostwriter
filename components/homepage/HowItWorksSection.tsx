import React from "react"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"

interface WorkflowStep {
  icon: keyof typeof LucideIcons
  title: string
  description: string
}

export const HowItWorksSection: React.FC<{ workflowSteps: WorkflowStep[] }> = ({ workflowSteps }) => (
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
      {workflowSteps.map((step, index) => {
        const Icon = LucideIcons[step.icon] || LucideIcons.Settings
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-center"
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 fire-glow">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>
            </div>
            <h4 className="text-lg font-semibold mb-2 ghost-glow">{step.title}</h4>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </motion.div>
        )
      })}
    </div>
  </section>
) 