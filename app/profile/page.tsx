"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star } from "lucide-react"

export default function ProfilePage() {
  const [preferredTone, setPreferredTone] = useState("professional")
  const [preferredStyle, setPreferredStyle] = useState("narrative")
  const [preferredVoice, setPreferredVoice] = useState("alloy")

  const usageStats = {
    totalGenerated: 47,
    wordsGenerated: 12450,
    voiceMinutes: 23,
    savedContent: 15,
  }

  const pricingPlans = [
    {
      name: "Apprentice",
      price: "$9",
      period: "/month",
      features: ["100 generations/month", "Basic voices", "Standard support"],
      current: true,
    },
    {
      name: "Ghostwriter",
      price: "$29",
      period: "/month",
      features: ["Unlimited generations", "Premium voices", "Priority support", "Advanced styles"],
      popular: true,
    },
    {
      name: "Phantom",
      price: "$99",
      period: "/month",
      features: ["Everything in Ghostwriter", "Custom voice cloning", "API access", "White-label option"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold ghost-glow">Profile Settings</h1>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Preferences */}
                <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="ghost-glow">Writing Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tone">Preferred Tone</Label>
                      <Select value={preferredTone} onValueChange={setPreferredTone}>
                        <SelectTrigger className="bg-black/50 border-purple-900/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-900/30">
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="serious">Serious</SelectItem>
                          <SelectItem value="mysterious">Mysterious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="style">Preferred Style</Label>
                      <Select value={preferredStyle} onValueChange={setPreferredStyle}>
                        <SelectTrigger className="bg-black/50 border-purple-900/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-900/30">
                          <SelectItem value="narrative">Narrative</SelectItem>
                          <SelectItem value="descriptive">Descriptive</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="voice">Preferred Voice</Label>
                      <Select value={preferredVoice} onValueChange={setPreferredVoice}>
                        <SelectTrigger className="bg-black/50 border-purple-900/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-900/30">
                          <SelectItem value="alloy">Alloy</SelectItem>
                          <SelectItem value="echo">Echo</SelectItem>
                          <SelectItem value="fable">Fable</SelectItem>
                          <SelectItem value="onyx">Onyx</SelectItem>
                          <SelectItem value="nova">Nova</SelectItem>
                          <SelectItem value="shimmer">Shimmer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="ghost-glow">Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{usageStats.totalGenerated}</div>
                        <div className="text-sm text-gray-400">Content Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {usageStats.wordsGenerated.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Words Written</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{usageStats.voiceMinutes}</div>
                        <div className="text-sm text-gray-400">Voice Minutes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{usageStats.savedContent}</div>
                        <div className="text-sm text-gray-400">Saved Items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Plans */}
              <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                <CardHeader>
                  <CardTitle className="ghost-glow">Subscription Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {pricingPlans.map((plan, index) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card
                          className={`relative ${
                            plan.popular
                              ? "border-purple-600 fire-glow"
                              : plan.current
                                ? "border-green-600"
                                : "border-purple-900/30"
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-purple-600 to-red-600">
                                <Star className="mr-1 h-3 w-3" />
                                Most Popular
                              </Badge>
                            </div>
                          )}
                          {plan.current && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-green-600">
                                <Crown className="mr-1 h-3 w-3" />
                                Current Plan
                              </Badge>
                            </div>
                          )}
                          <CardHeader className="text-center">
                            <CardTitle className="ghost-glow">{plan.name}</CardTitle>
                            <div className="text-3xl font-bold">
                              {plan.price}
                              <span className="text-lg text-gray-400">{plan.period}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 mb-6">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-sm">
                                  <Zap className="mr-2 h-4 w-4 text-purple-400" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full ${
                                plan.current
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow"
                              }`}
                              disabled={plan.current}
                            >
                              {plan.current ? "Current Plan" : "Upgrade"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
