"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { ContentGenerator } from "@/components/dashboard/content-generator"
import { SavedContent } from "@/components/dashboard/saved-content"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FileText, BookOpen, Mic, Save } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("blogs")

  // Mock stats data - replace with real data from your backend
  const stats = {
    blogs: 12,
    stories: 8,
    speeches: 5,
    history: 25,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Content Studio</h1>

              <div className="space-y-6">
                <StatsCards stats={stats} />

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
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
