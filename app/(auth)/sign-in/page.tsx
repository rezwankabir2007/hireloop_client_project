'use client'

import { AuthForm, AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {

  const handleSignIn = async (data: AuthFormData) => {
    const { data: SignInResponse, error } = await authClient.signIn.email({
      email: data.email as string, // এখানে data.name এর পরিবর্তে data.email হবে
      password: data.password, 
      rememberMe: true, 
      callbackURL: "/", 
    });

    console.log('sign in response', SignInResponse, error);
  }

  // এখানে onSubmit={handleSignIn} যোগ করা হয়েছে
  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}