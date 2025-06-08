import mongoose, { Schema } from "mongoose"

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["blog", "story", "speech"],
    },
    tone: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
    }],
    metaDescription: {
      type: String,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create compound index for title and userId to prevent duplicates
BlogSchema.index({ title: 1, userId: 1 }, { unique: true })

// Create indexes for better query performance
BlogSchema.index({ slug: 1 })
BlogSchema.index({ userId: 1 })
BlogSchema.index({ type: 1 })
BlogSchema.index({ createdAt: -1 })
BlogSchema.index({ tags: 1 })

// Calculate reading time before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200
    const wordCount = this.content.split(/\s+/).length
    this.readingTime = Math.ceil(wordCount / wordsPerMinute)
  }
  next()
})

// Generate slug before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    this.slug = baseSlug
  }
  next()
})

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema) 