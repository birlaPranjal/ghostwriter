import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Ghost, Sparkles, Users } from "lucide-react"

const features = [
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
]

export const FeaturesSection: React.FC = () => (
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
      {features.map((feature, index) => (
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
) 