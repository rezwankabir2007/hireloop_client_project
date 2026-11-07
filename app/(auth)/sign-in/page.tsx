'use client'

import { AuthForm, AuthFormData } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (data: AuthFormData) => {
    const { data: SignInResponse, error } = await authClient.signIn.email({
      email: data.email as string, 
      password: data.password, 
      rememberMe: true, 
      callbackURL: "/", 
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed in successfully!");
    router.push("/");
    router.refresh();
  }

  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}