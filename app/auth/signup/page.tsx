"use client"

import { useForm } from "react-hook-form"
import { User } from "lucide-react"
import Link from "next/link"
import AuthLayout from "@/components/auth/auth-layout"
import SocialSignInButton from "@/components/auth/social-sign-in-button"
import FormInput from "@/components/ui/form-input"
import { useSignUp } from "@/hooks/use-auth"
import type { SignUpFormData } from "@/types/auth"

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>()
  const { isLoading, handleSignUp, handleGoogleSignIn } = useSignUp()
  const password = watch("password")

  return (
    <AuthLayout title="Create Account" description="Join us to start your writing journey">
      <SocialSignInButton isLoading={isLoading} onClick={handleGoogleSignIn} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-purple-900/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400">Or sign up with email</span>
        </div>
      </div>
      <form onSubmit={handleSubmit((data) => handleSignUp({ name: data.name, email: data.email, password: data.password }))} className="space-y-4">
        <FormInput
          label="Name"
          id="name"
          type="text"
          register={register("name", { required: "Name is required" })}
          error={errors.name}
          placeholder="Enter your name"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <FormInput
          label="Email"
          id="email"
          type="email"
          register={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          error={errors.email}
          placeholder="Enter your email"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          })}
          error={errors.password}
          placeholder="Create a password"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: value => value === password || "Passwords do not match"
          })}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          className="bg-black/50 border-purple-900/30 focus:border-purple-600"
        />
        <div className="w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow rounded-md py-2 px-4 text-white font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            <User className="mr-2 h-4 w-4" />
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </p>
        <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
          Back to Home
        </Link>
      </div>
    </AuthLayout>
  )
} 