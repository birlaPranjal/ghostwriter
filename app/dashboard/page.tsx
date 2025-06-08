"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { GhostChatbot } from "@/components/dashboard/ghost-chatbot"
import { FileText, BookOpen, Mic, History, Save, Calendar, Eye, Loader2 } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  content: string
  type: string
  tone: string
  style: string
  emotion: string
  createdAt: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("blogs")
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock stats data - you can replace this with real data from your backend
  const stats = [
    { title: "Blogs", value: recentBlogs.length, icon: FileText, color: "text-blue-400" },
    { title: "Stories", value: 8, icon: BookOpen, color: "text-purple-400" },
    { title: "Speeches", value: 5, icon: Mic, color: "text-red-400" },
    { title: "History", value: 25, icon: History, color: "text-orange-400" },
  ]

  const tabs = [
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "stories", label: "Stories", icon: BookOpen },
    { id: "speeches", label: "Speeches", icon: Mic },
    { id: "saved", label: "Saved", icon: Save },
  ]

  // Fetch recent blogs
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/recent-blogs")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch blogs")
        }

        setRecentBlogs(data.blogs || [])
      } catch (error) {
        console.error("Error fetching recent blogs:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "blogs") {
      fetchRecentBlogs()
    }
  }, [activeTab])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const renderContent = () => {
    if (activeTab === "blogs") {
      if (loading) {
        return (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <span className="ml-2 text-purple-300">Loading blogs...</span>
          </div>
        )
      }

      if (error) {
        return (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-purple-600 text-purple-300"
            >
              Try Again
            </Button>
          </div>
        )
      }

      if (recentBlogs.length === 0) {
        return (
          <div className="text-center text-purple-300/70 py-12">
            <FileText className="h-16 w-16 mx-auto text-purple-400/50 mb-4" />
            <p className="text-lg">No blogs generated yet</p>
            <p className="text-sm mt-2">Start creating amazing content with our AI-powered tools</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {recentBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="bg-gradient-to-br from-purple-950/10 to-black/50 border-purple-900/20 hover:border-purple-600/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-purple-100 ghost-glow line-clamp-1">{blog.title}</h3>
                    <div className="flex items-center text-sm text-purple-400 ml-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>

                  <p className="text-purple-300/80 text-sm mb-4 line-clamp-3">{truncateContent(blog.content)}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                        {blog.tone}
                      </Badge>
                      <Badge variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                        {blog.style}
                      </Badge>
                      <Badge variant="outline" className="border-purple-600/50 text-purple-300 text-xs">
                        {blog.emotion}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    }

    // Default empty state for other tabs
    return (
      <div className="text-center text-purple-300/70 py-12">
        <div className="mb-4">
          {activeTab === "stories" && <BookOpen className="h-16 w-16 mx-auto text-purple-400/50" />}
          {activeTab === "speeches" && <Mic className="h-16 w-16 mx-auto text-purple-400/50" />}
          {activeTab === "saved" && <Save className="h-16 w-16 mx-auto text-purple-400/50" />}
        </div>
        <p className="text-lg">No {activeTab} generated yet</p>
        <p className="text-sm mt-2">Start creating amazing content with our AI-powered tools</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-8 ghost-glow">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 hover:border-purple-600/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-300 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold ghost-glow">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-800/20`}>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {tabs.map((tab) => (
                  <motion.div key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setActiveTab(tab.id)}
                      variant={activeTab === tab.id ? "default" : "outline"}
                      className={`w-full h-16 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                          : "border-purple-600/30 text-purple-300 hover:bg-purple-900/20"
                      }`}
                    >
                      <tab.icon className="mr-2 h-5 w-5" />
                      {tab.label}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Content Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                  <CardHeader>
                    <CardTitle className="ghost-glow">
                      Recent {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">{renderContent()}</CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Ghost Chatbot */}
      <GhostChatbot />
    </div>
  )
}
