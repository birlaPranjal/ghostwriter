import React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface JoinClubSectionProps {
  email: string
  setEmail: (v: string) => void
  handleEmailSubmit: (e: React.FormEvent) => void
}

export const JoinClubSection: React.FC<JoinClubSectionProps> = ({ email, setEmail, handleEmailSubmit }) => (
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
            onChange={e => setEmail(e.target.value)}
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
) 