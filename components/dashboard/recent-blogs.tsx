"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Blog {
  _id: string
  title: string
  type: string
  tone: string
  style: string
  emotion: string
  createdAt: string
}

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const response = await fetch("/api/blogs/recent")
        if (!response.ok) throw new Error("Failed to fetch blogs")
        const data = await response.json()
        setBlogs(data.blogs)
      } catch (error) {
        console.error("Error fetching recent blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentBlogs()
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
        <CardHeader>
          <CardTitle className="ghost-glow">Recent Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-purple-900/20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (blogs.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
        <CardHeader>
          <CardTitle className="ghost-glow">Recent Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No blogs generated yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
      <CardHeader>
        <CardTitle className="ghost-glow">Recent Blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-lg bg-purple-900/10 p-4 hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-purple-200 group-hover:text-purple-100 transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900/30 text-purple-300">
                      {blog.type}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900/30 text-purple-300">
                      {blog.tone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="mr-1 h-4 w-4" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Link
                href={`/dashboard/content/${blog._id}`}
                className="absolute inset-0"
              >
                <span className="sr-only">View blog</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <Link href={`/dashboard/content/${blog._id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 