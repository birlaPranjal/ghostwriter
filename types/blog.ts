import { Document, Types } from 'mongoose'

export interface IBlogBase {
  title: string
  content: string
  imageUrl: string
  published: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface IBlog extends IBlogBase, Document {
  authorId: Types.ObjectId
}

export interface PopulatedBlog extends IBlogBase {
  _id: Types.ObjectId
  authorId: {
    _id: Types.ObjectId
    name: string
    image: string
    email: string
  }
}

export interface BlogResponse {
  id: string
  title: string
  content: string
  imageUrl: string
  publishedAt: string
  author: {
    name: string
    image: string
  }
} 