"use client"

import { AuthForm, type AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter()

  const handleSignUp = async (data: AuthFormData) => {
    if (!data.name || !data.requestedRole) {
      toast.error("Please provide your name and account type.")
      return
    }

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      requestedRole: data.requestedRole,
      callbackURL: "/",
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (data.requestedRole === "admin") {
      toast.info("Account created. Your admin access request was recorded; admin privileges require approval.")
    } else {
      toast.success("Account created successfully!")
    }

    router.push("/")
    router.refresh()
  }

  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}