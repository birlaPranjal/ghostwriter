import React from "react"
import { Card } from "@/components/ui/card"
import { Ghost } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  avatar: string
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, quote, avatar }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-purple-900/30 hover:border-purple-600/50 transition-all duration-300 relative overflow-hidden h-[200px] flex flex-col">
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 right-2"
      >
        <Ghost className="h-6 w-6 text-purple-400" />
      </motion.div>
      <div className="flex items-center mb-4">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold ghost-glow">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-muted-foreground italic">{quote}</p>
    </Card>
  </motion.div>
) 