"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { ContentGenerator } from "@/components/dashboard/content-generator"
import { SavedContent } from "@/components/dashboard/saved-content"
import { FileText, BookOpen, Mic, Save, Crown, Star, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("blogs")

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Content Studio</h1>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-purple-950/20 border border-purple-900/30">
                  <TabsTrigger
                    value="blogs"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Blogs
                  </TabsTrigger>
                  <TabsTrigger
                    value="stories"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Stories
                  </TabsTrigger>
                  <TabsTrigger
                    value="speeches"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Speeches
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Saved
                  </TabsTrigger>
                </TabsList>

                <div className="grid lg:grid-cols-2 gap-6">
                  <TabsContent value="blogs" className="space-y-6 m-0">
                    <ContentGenerator type="blog" />
                  </TabsContent>

                  <TabsContent value="stories" className="space-y-6 m-0">
                    <ContentGenerator type="story" />
                  </TabsContent>

                  <TabsContent value="speeches" className="space-y-6 m-0">
                    <ContentGenerator type="speech" />
                  </TabsContent>

                  <TabsContent value="saved" className="space-y-6 m-0">
                    <SavedContent />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Subscription Plans */}
              <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 mt-6">
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
