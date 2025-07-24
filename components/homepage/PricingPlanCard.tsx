import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Crown, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface PricingPlanCardProps {
  name: string
  price: string
  period: string
  features: string[]
  current?: boolean
  popular?: boolean
}

export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({ name, price, period, features, current, popular }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card
      className={`relative p-6 bg-card/50 backdrop-blur-sm ${
        popular
          ? "border-purple-600 fire-glow"
          : current
          ? "border-green-600"
          : "border-purple-900/30"
      } hover:border-purple-600/50 transition-all duration-300 h-[380px] flex flex-col`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-purple-600 to-red-600">
            <Star className="mr-1 h-3 w-3" /> Most Popular
          </Badge>
        </div>
      )}
      {current && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-600">
            <Crown className="mr-1 h-3 w-3" /> Current Plan
          </Badge>
        </div>
      )}
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold mb-2 ghost-glow">{name}</h4>
        <div className="text-4xl font-bold">
          {price}
          <span className="text-lg text-muted-foreground">{period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-muted-foreground">
            <Zap className="mr-3 h-4 w-4 text-purple-400" />
            {feature}
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
        <button
          className={`w-full rounded px-4 py-2 font-semibold transition-colors duration-200 text-white ${
            current
              ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow"
          }`}
          disabled={current}
        >
          {current ? "Current Plan" : "Upgrade"}
        </button>
      </motion.div>
    </Card>
  </motion.div>
) 