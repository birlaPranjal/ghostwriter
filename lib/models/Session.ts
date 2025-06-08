import mongoose, { Schema, type Document } from "mongoose"

export interface ISession extends Document {
  sessionToken: string
  userId: string
  expires: Date
}

const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expires: { type: Date, required: true },
})

export default mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema)
