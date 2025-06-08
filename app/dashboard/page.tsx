"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { SavedContent } from "@/components/dashboard/saved-content"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FileText, BookOpen, Mic, Save } from "lucide-react"
import { RecentBlogs } from "@/components/dashboard/recent-blogs"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("blogs")
  const [stats, setStats] = useState({
    blogs: 0,
    stories: 0,
    speeches: 0,
    history: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Dashboard</h1>

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
                      <RecentBlogs />
                    </TabsContent>

                    <TabsContent value="stories" className="space-y-6 m-0">
                      <SavedContent type="story" />
                    </TabsContent>

                    <TabsContent value="speeches" className="space-y-6 m-0">
                      <SavedContent type="speech" />
                    </TabsContent>

                    <TabsContent value="saved" className="space-y-6 m-0">
                      <SavedContent type="all" />
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
