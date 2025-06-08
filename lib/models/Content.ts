import mongoose, { Schema, Types } from 'mongoose';

// Base content schema
const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
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
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  type: {
    type: String,
    enum: ['blog', 'story', 'speech'],
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  discriminatorKey: 'type',
});

// Blog specific schema
const blogSchema = new Schema({
  imageUrl: String,
  tone: {
    type: String,
    enum: ['Professional', 'Casual', 'Friendly', 'Formal', 'Humorous', 'Serious', 'Enthusiastic', 'Neutral'],
    default: 'Professional',
  },
  style: {
    type: String,
    enum: ['Narrative', 'Descriptive', 'Persuasive', 'Expository', 'Analytical', 'Conversational', 'Technical', 'Creative'],
    default: 'Narrative',
  },
  emotion: {
    type: String,
    enum: ['Happy', 'Sad', 'Angry', 'Excited', 'Calm', 'Anxious', 'Inspired', 'Neutral'],
    default: 'Neutral',
  },
});

// Story specific schema
const storySchema = new Schema({
  genre: {
    type: String,
    enum: ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Horror', 'Adventure', 'Historical', 'Contemporary'],
    default: 'Fantasy',
  },
  targetAudience: {
    type: String,
    enum: ['Children', 'Young Adult', 'Adult', 'All Ages'],
    default: 'All Ages',
  },
  length: {
    type: String,
    enum: ['Short', 'Medium', 'Long'],
    default: 'Medium',
  },
  characters: [{
    name: String,
    description: String,
    role: String,
  }],
});

// Speech specific schema
const speechSchema = new Schema({
  occasion: {
    type: String,
    enum: ['Business', 'Academic', 'Wedding', 'Graduation', 'Motivational', 'Political', 'Social'],
    default: 'Business',
  },
  duration: {
    type: Number, // in minutes
    default: 5,
  },
  tone: {
    type: String,
    enum: ['Formal', 'Semi-formal', 'Casual', 'Inspirational', 'Humorous', 'Serious'],
    default: 'Formal',
  },
  audienceSize: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    default: 'Medium',
  },
});

// Create models
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);
const Blog = Content.discriminator('blog', blogSchema);
const Story = Content.discriminator('story', storySchema);
const Speech = Content.discriminator('speech', speechSchema);

export { Content, Blog, Story, Speech };
