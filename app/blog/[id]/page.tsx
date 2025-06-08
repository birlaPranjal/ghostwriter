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
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return notFound()
  }

  await connectDB()

  const blog = await Blog.findById(params.id)
    .populate({
      path: 'authorId',
      select: 'name image email',
      model: 'User'
    })
    .lean() as PopulatedBlog | null

  if (!blog) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="relative w-full h-[400px] mb-6">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">{blog.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Image
                src={blog.authorId.image || '/default-avatar.png'}
                alt={blog.authorId.name}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span>{blog.authorId.name}</span>
            </div>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            {blog.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 