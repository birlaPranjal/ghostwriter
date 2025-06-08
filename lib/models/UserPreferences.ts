import mongoose, { Schema, type Document } from "mongoose"

export interface IUserPreferences extends Document {
  userId: string
  preferredTone: string
  preferredStyle: string
  preferredVoice: string
  preferredEmotion: string
  createdAt: Date
  updatedAt: Date
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: { type: String, required: true, unique: true },
    preferredTone: { type: String, default: "professional" },
    preferredStyle: { type: String, default: "narrative" },
    preferredVoice: { type: String, default: "alloy" },
    preferredEmotion: { type: String, default: "inspiring" },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>("UserPreferences", UserPreferencesSchema)
