import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"
import { BlogEditor } from "@/components/dashboard/blog-editor"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"

interface EditBlogPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-6">
            <div className="max-w-6xl mx-auto">
              <BlogEditor
                blogId={blog._id.toString()}
                initialTitle={blog.title}
                initialContent={blog.content}
                initialTone={blog.tone}
                initialStyle={blog.style}
                initialEmotion={blog.emotion}
                initialImageUrl={blog.imageUrl}
                isEditing={true}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 