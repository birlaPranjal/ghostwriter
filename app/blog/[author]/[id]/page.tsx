import { notFound } from "next/navigation"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"
import { BlogDisplay } from "@/components/dashboard/blog-display"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface PublicBlogPageProps {
  params: {
    author: string
    id: string
  }
}

export default async function PublicBlogPage({ params }: PublicBlogPageProps) {
  await connectDB()

  const blog = await Blog.findById(params.id)
  if (!blog) {
    return notFound()
  }

  // Get the session to check if the current user is the author
  const session = await getServerSession(authOptions)
  const isAuthor = session?.user?.id === blog.userId.toString()

  // Generate a random author name if not available
  const authorName = blog.userId?.name || generateRandomName()

  return (
    <div className="min-h-screen bg-black">
      <BlogDisplay
        title={blog.title}
        content={blog.content}
        tone={blog.tone}
        style={blog.style}
        emotion={blog.emotion}
        imageUrl={blog.imageUrl}
        authorId={blog.userId.toString()}
        blogId={blog._id.toString()}
        authorName={authorName}
      />
    </div>
  )
}

// Function to generate a random author name
function generateRandomName(): string {
  const adjectives = [
    "Mysterious", "Creative", "Brilliant", "Curious", "Witty",
    "Thoughtful", "Insightful", "Passionate", "Dynamic", "Eloquent"
  ]
  const nouns = [
    "Writer", "Thinker", "Explorer", "Dreamer", "Artist",
    "Scholar", "Philosopher", "Poet", "Sage", "Visionary"
  ]
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 1000)
  
  return `${randomAdjective}${randomNoun}${randomNumber}`
} 