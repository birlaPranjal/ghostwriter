import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Copy, Zap } from "lucide-react"

interface ApiPreviewSectionProps {
  apiFeatures: string[]
  codeSnippet: string
}

export const ApiPreviewSection: React.FC<ApiPreviewSectionProps> = ({ apiFeatures, codeSnippet }) => (
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
        <div className="p-6 bg-black/90 border-purple-900/30 font-mono text-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-400">$ API Request</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(codeSnippet)}
              className="hover:bg-purple-900/20"
              aria-label="Copy API code snippet"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="text-green-300 whitespace-pre-wrap">{codeSnippet}</pre>
        </div>
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
          <a href="/auth/signin">
            <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow">
              Get API Access
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
) 