import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Placeholder for error logging
function logError(error: any) {
  // TODO: Integrate with error logging service
}

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Signed in successfully!")
        router.push("/dashboard")
      }
    } catch (error) {
      logError(error)
      toast.error("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      logError(error)
      toast.error("Error signing in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, handleSignIn, handleGoogleSignIn }
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }
      // Sign in after registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      logError(error)
      toast.error(error.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      logError(error)
      toast.error("Error signing in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, handleSignUp, handleGoogleSignIn }
} 