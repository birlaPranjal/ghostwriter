import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Blog } from "@/lib/models/Content"
import { ContentDisplay } from "@/components/content-studio/content-display"

interface BlogPageProps {
  params: {
    id: string
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  await connectToDatabase()

  const blog = await Blog.findById(params.id)
  if (!blog) {
    notFound()
  }

  return <ContentDisplay content={blog} />
} 