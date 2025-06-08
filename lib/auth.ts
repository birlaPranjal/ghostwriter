import { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "./mongodb"
import User from "./models/User"
import bcrypt from "bcryptjs"
import clientPromise from "./mongodb-adapter"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password")
        }

        await connectDB()

        // Find user by email
        const user = await User.findOne({ email: credentials.email })

        // If user doesn't exist, create a new one
        if (!user) {
          const newUser = await User.create({
            email: credentials.email,
            password: credentials.password,
          })
          
          return {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
          }
        }

        // If user exists but no password (OAuth user)
        if (!user.password) {
          throw new Error("Please sign in with your OAuth provider")
        }

        // Verify password
        const isValid = await user.comparePassword(credentials.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} 