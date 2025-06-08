"use server"

import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { PopulatedBlog } from "@/types/blog"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connectDB()

  const blog = await Blog.findById(params.id)
    .populate('authorId', 'name image email')
    .lean() as unknown as PopulatedBlog | null

  if (!blog) {
    return notFound()
  }

  // Get the session to check if the current user is the author
  const session = await getServerSession(authOptions)
  const isAuthor = session?.user?.email === blog.authorId.email

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-purple-950/20 border-purple-900/30">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={blog.authorId.image || "/images/default-avatar.png"}
                alt={blog.authorId.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">{blog.authorId.name}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {blog.imageUrl && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="prose prose-invert max-w-none">
            {blog.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 