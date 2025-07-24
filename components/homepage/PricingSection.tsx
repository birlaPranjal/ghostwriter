import React from "react"
import { motion } from "framer-motion"
import { PricingPlanCard } from "./PricingPlanCard"

interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  current?: boolean
  popular?: boolean
}

export const PricingSection: React.FC<{ pricingPlans: PricingPlan[] }> = ({ pricingPlans }) => (
  <section className="container mx-auto px-4 py-20 relative z-10">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h3 className="text-4xl font-bold mb-4 ghost-glow">Subscription Plans</h3>
      <p className="text-muted-foreground text-lg">Choose the perfect plan for your ghostwriting needs</p>
    </motion.div>
    <div className="grid md:grid-cols-3 gap-8">
      {pricingPlans.map((plan, i) => (
        <PricingPlanCard key={plan.name} {...plan} />
      ))}
    </div>
  </section>
) 