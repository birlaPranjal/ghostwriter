import mongoose, { Schema, type Document } from "mongoose"

export interface IContent extends Document {
  title: string
  content: string
  type: string
  tone?: string
  style?: string
  emotion?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    tone: { type: String },
    style: { type: String },
    emotion: { type: String },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Content || mongoose.model<IContent>("Content", ContentSchema)
