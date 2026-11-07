"use client"

import { AuthForm, AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {

  const handleSignUp = async (data: AuthFormData) => {
    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: data.name as string,
      email: data.email,
      password: data.password,
      callbackURL: "/", 
    });

    console.log("signup response", signUpResponse, error);
  }

  // এখানে onSubmit={handleSignUp} যুক্ত করা হয়েছে
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}