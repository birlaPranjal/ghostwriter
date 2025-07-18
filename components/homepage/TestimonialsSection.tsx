import React from "react"
import { motion } from "framer-motion"
import { TestimonialCard } from "./TestimonialCard"

interface Testimonial {
  name: string
  role: string
  quote: string
  avatar: string
}

export const TestimonialsSection: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => (
  <section className="container mx-auto px-4 py-20 relative z-10">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h3 className="text-4xl font-bold mb-4 ghost-glow">Loved by Creators</h3>
      <p className="text-muted-foreground text-lg">Join thousands of writers who've found their voice</p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, i) => (
        <TestimonialCard key={i} {...testimonial} />
      ))}
    </div>
  </section>
) 