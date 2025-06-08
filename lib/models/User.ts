import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name?: string
  email: string
  password?: string
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  accounts: mongoose.Types.ObjectId[]
  sessions: mongoose.Types.ObjectId[]
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    emailVerified: { type: Date },
    image: { type: String },
    accounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    }],
    sessions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    }],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password!, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password!)
  } catch (error) {
    throw error
  }
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
