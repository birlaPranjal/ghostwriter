"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { BlogDisplay } from "@/components/dashboard/blog-display"
import { Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogEditor } from "@/components/dashboard/blog-editor"

interface Blog {
  _id: string
  title: string
  content: string
  tone: string
  style: string
  emotion: string
  imageUrl: string
  publishedAt: string
  authorId: {
    _id: string
    name: string
    image: string
  }
}

export default function BlogPage({ params }: { params: { author: string; id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch blog")
        const data = await response.json()
        setBlog(data)
      } catch (error) {
        console.error("Error fetching blog:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Blog not found</p>
      </div>
    )
  }

  if (isEditing) {
    return (
      <BlogEditor
        blogId={blog._id}
        initialTitle={blog.title}
        initialContent={blog.content}
        initialTone={blog.tone}
        initialStyle={blog.style}
        initialEmotion={blog.emotion}
        initialImageUrl={blog.imageUrl}
        isEditing={true}
      />
    )
  }

  const isAuthor = session?.user?.id === blog.authorId._id

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {isAuthor && (
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <Button
            variant="outline"
            className="border-purple-600 text-purple-300 hover:bg-purple-900/20"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Blog
          </Button>
        </div>
      )}
      <BlogDisplay
        title={blog.title}
        content={blog.content}
        tone={blog.tone}
        style={blog.style}
        emotion={blog.emotion}
        authorId={blog.authorId._id}
        blogId={blog._id}
        authorName={blog.authorId.name}
        imageUrl={blog.imageUrl}
        contentLength={blog.emotion as 'brief' | 'descriptive' | 'detailed'}
      />
    </div>
  )
} 