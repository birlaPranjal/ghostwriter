import React from "react"
import { motion } from "framer-motion"
import { CreationTypeCard } from "./CreationTypeCard"

interface CreationType {
  icon: string
  title: string
  description: string
  example: string
}

export const WhatYouCanCreateSection: React.FC<{ creationTypes: CreationType[] }> = ({ creationTypes }) => (
  <section className="container mx-auto px-4 py-20 relative z-10">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h3 className="text-4xl font-bold mb-4 ghost-glow">What You Can Create</h3>
      <p className="text-muted-foreground text-lg">Bring your ideas to life with supernatural precision</p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8">
      {creationTypes.map((type, i) => (
        <CreationTypeCard key={i} {...type} />
      ))}
    </div>
  </section>
) 