"use client"

import { AuthForm, AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // রাউটার ইমপোর্ট করুন

export default function SignUpPage() {
  const router = useRouter(); // রাউটার হুক ইনিশিয়ালাইজ করুন

  const handleSignUp = async (data: AuthFormData) => {
    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: data.name as string,
      email: data.email,
      password: data.password,
      callbackURL: "/", 
    });

    console.log("signup response", signUpResponse, error);

    // যদি কোনো এরর না থাকে, তবে ম্যানুয়ালি হোম পেজে পাঠিয়ে দিন
    if (!error) {
      router.push("/");
      router.refresh(); // ক্যাশ ক্লিয়ার করে সেশন আপডেট করতে সাহায্য করবে
    } else {
      console.error("Sign up failed:", error);
    }
  }

  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}