"use client"

import { useForm } from "react-hook-form"
import { Lock } from "lucide-react"
import Link from "next/link"
import AuthLayout from "@/components/auth/auth-layout"
import SocialSignInButton from "@/components/auth/social-sign-in-button"
import FormInput from "@/components/ui/form-input"
import { useSignIn } from "@/hooks/use-auth"
import type { SignInFormData } from "@/types/auth"

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>()
  const { isLoading, handleSignIn, handleGoogleSignIn } = useSignIn()

  return (
    <AuthLayout title="Welcome Back" description="Sign in to continue your writing journey">
      <SocialSignInButton isLoading={isLoading} onClick={handleGoogleSignIn} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-900/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400">Or continue with email</span>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
        <FormInput
          label="Email"
          id="email"
          type="email"
          register={register("email", { required: "Email is required" })}
          error={errors.email}
          placeholder="Enter your email"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          register={register("password", { required: "Password is required" })}
          error={errors.password}
          placeholder="Enter your password"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <div className="w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow rounded-md py-2 px-4 text-white font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            <Lock className="mr-2 h-4 w-4" />
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </button>
        </div>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
        <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
          Back to Home
        </Link>
      </div>
    </AuthLayout>
  )
}
