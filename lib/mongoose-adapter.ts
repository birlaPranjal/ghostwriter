import type { Adapter } from "next-auth/adapters"
import connectDB from "./mongodb"
import User from "./models/User"
import Account from "./models/Account"
import Session from "./models/Session"
import VerificationTokenModel from "./models/VerificationToken"

export function MongooseAdapter(): Adapter {
  return {
    async createUser(user) {
      await connectDB()
      const newUser = await User.create(user)
      return {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
        emailVerified: newUser.emailVerified,
      }
    },

    async getUser(id) {
      await connectDB()
      const user = await User.findById(id).lean()
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      }
    },

    async getUserByEmail(email) {
      await connectDB()
      const user = await User.findOne({ email }).lean()
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      await connectDB()
      const account = await Account.findOne({ provider, providerAccountId }).lean()
      if (!account) return null
      const user = await User.findById(account.userId).lean()
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      }
    },

    async updateUser(user) {
      await connectDB()
      const updatedUser = await User.findByIdAndUpdate(user.id, user, { new: true }).lean()
      if (!updatedUser) throw new Error("User not found")
      return {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
      }
    },

    async deleteUser(userId) {
      await connectDB()
      await Promise.all([
        User.findByIdAndDelete(userId),
        Account.deleteMany({ userId }),
        Session.deleteMany({ userId }),
      ])
    },

    async linkAccount(account) {
      await connectDB()
      await Account.create(account)
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await connectDB()
      await Account.findOneAndDelete({ provider, providerAccountId })
    },

    async createSession(session) {
      await connectDB()
      const newSession = await Session.create(session)
      return {
        sessionToken: newSession.sessionToken,
        userId: newSession.userId,
        expires: newSession.expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      await connectDB()
      const session = await Session.findOne({ sessionToken }).lean()
      if (!session) return null
      const user = await User.findById(session.userId).lean()
      if (!user) return null
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        },
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        },
      }
    },

    async updateSession(session) {
      await connectDB()
      const updatedSession = await Session.findOneAndUpdate({ sessionToken: session.sessionToken }, session, {
        new: true,
      }).lean()
      if (!updatedSession) return null
      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId,
        expires: updatedSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await connectDB()
      await Session.findOneAndDelete({ sessionToken })
    },

    async createVerificationToken(token) {
      await connectDB()
      await VerificationTokenModel.create(token)
      return token
    },

    async useVerificationToken({ identifier, token }) {
      await connectDB()
      const verificationToken = await VerificationTokenModel.findOneAndDelete({
        identifier,
        token,
      }).lean()
      if (!verificationToken) return null
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      }
    },
  }
}
