import mongoose, { Schema, Types } from 'mongoose';
import { IBlog } from '@/types/blog';

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['blog', 'story', 'speech'],
    default: 'blog',
  },
  tone: {
    type: String,
    default: 'professional',
  },
  style: {
    type: String,
    default: 'narrative',
  },
  emotion: {
    type: String,
    default: 'neutral',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
blogSchema.index({ authorId: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ type: 1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema); 