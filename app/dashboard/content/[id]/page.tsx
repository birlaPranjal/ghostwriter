import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"
import { getImageUrl } from "@/lib/pexels"
import { BlogDisplay } from "@/components/dashboard/blog-display"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"

interface BlogPageProps {
  params: {
    id: string
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return notFound()
  }

  await connectDB()

  const blog = await Blog.findOne({
    _id: params.id,
    userId: session.user.id,
  })

  if (!blog) {
    return notFound()
  }

  // Get a relevant image from Pexels
  const imageUrl = await getImageUrl(blog.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <BlogDisplay
                title={blog.title}
                content={blog.content}
                tone={blog.tone}
                style={blog.style}
                emotion={blog.emotion}
                imageUrl={imageUrl}
                authorId={blog.userId}
                blogId={blog._id}
                authorName={blog.authorName}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 