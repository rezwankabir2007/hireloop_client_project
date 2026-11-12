"use client"

import { AuthForm, AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const handleSignIn = async (data: AuthFormData) => {
    const { error } = await authClient.signIn.email({
      email: data.email as string, 
      password: data.password, 
      rememberMe: true, 
      callbackURL: redirectTo, // Better-auth এর নিজস্ব রিডাইরেক্ট
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully!");
    router.push(redirectTo);
    router.refresh();
  };

  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}