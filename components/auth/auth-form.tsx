"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import logo from "../../app/images/logo.png"

// ডাটার টাইপ ডিফাইন করা হলো
export type AuthFormData = {
  email: string
  password: string
  name?: string
}

// Props এ onSubmit যুক্ত করা হলো
type AuthFormProps = {
  mode: "sign-in" | "sign-up"
  onSubmit?: (data: AuthFormData) => void
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const isSignUp = mode === "sign-up"
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries())

    setNotice(
      `${Object.keys(values).length} fields collected locally. Connect your authentication provider to continue.`,
    )

    // ডাটা সঠিকভাবে সাজানো হলো
    const data: AuthFormData = {
      email: values.email as string,
      password: values.password as string, // স্পেলিং ঠিক করা হয়েছে (password)
      ...(isSignUp && values.name ? { name: values.name as string } : {}),
    }

    console.log(`${mode} form data:`, data)

    // প্যারেন্ট কম্পোনেন্টে ডাটা পাঠানো হচ্ছে
    onSubmit?.(data)
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#050505] px-4 py-8 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5545ed]/10 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-[1040px]">
        <header className="mb-6 flex items-center justify-between sm:mb-8">
          <Link href="/" aria-label="HireLoop home" className="shrink-0">
            <Image src={logo} alt="HireLoop" priority className="h-auto w-[104px]" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Back to home
          </Link>
        </header>

        <div className="grid overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0b0d]/95 shadow-[0_24px_100px_rgba(0,0,0,0.55)] md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden min-h-[580px] flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_95%,rgba(91,74,255,0.24),transparent_58%),linear-gradient(145deg,#111116,#09090b_72%)] p-9 md:flex lg:p-12">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                <BriefcaseBusiness aria-hidden="true" className="size-3.5 text-[#9187ff]" />
                Your next opportunity starts here
              </span>
              <h1 className="mt-7 max-w-sm text-4xl leading-[1.12] font-semibold tracking-[-0.045em]">
                {isSignUp ? (
                  <>
                    Find a role that{" "}
                    <span className="text-[#9b91ff]">moves you forward.</span>
                  </>
                ) : (
                  <>
                    Your next career chapter{" "}
                    <span className="text-[#9b91ff]">starts here.</span>
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                Connect with great companies, discover work that matters, and
                make your next move with HireLoop.
              </p>
            </div>

            <div className="relative z-10 rounded-xl border border-white/[0.08] bg-black/35 p-5 backdrop-blur-sm">
              <CheckCircle2
                aria-hidden="true"
                className="size-5 text-[#9187ff]"
              />
              <p className="mt-3 text-sm leading-6 text-white/75">
                “The right opportunity changed everything. HireLoop helped me
                find it.”
              </p>
              <p className="mt-3 text-xs text-white/40">A community of 2M+ job seekers</p>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-36 -bottom-48 size-[28rem] rounded-full border border-[#7769ff]/20 shadow-[0_0_100px_rgba(96,78,255,0.16)]"
            />
          </section>

          <section className="flex items-center justify-center p-6 sm:p-10 md:p-12">
            <div className="w-full max-w-[390px]">
              <p className="text-xs font-medium tracking-[0.16em] text-[#9b91ff] uppercase">
                {isSignUp ? "Create your account" : "Welcome back"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                {isSignUp ? "Get started" : "Sign in"}
              </h2>
              <p className="mt-2 text-sm text-white/50">
                {isSignUp
                  ? "Create an account to find your next opportunity."
                  : "Sign in to pick up where you left off."}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {isSignUp && (
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-medium text-white/75"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Smith"
                      required
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#766bff] focus:ring-2 focus:ring-[#766bff]/20"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-white/75"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#766bff] focus:ring-2 focus:ring-[#766bff]/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-medium text-white/75"
                    >
                      Password
                    </label>
                    {!isSignUp && (
                      <span className="text-[11px] text-white/35">
                        Forgot password? Ask your administrator
                      </span>
                    )}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#766bff] focus:ring-2 focus:ring-[#766bff]/20"
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-xs font-medium text-white/75"
                    >
                      Confirm password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      minLength={8}
                      required
                      className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#766bff] focus:ring-2 focus:ring-[#766bff]/20"
                    />
                  </div>
                )}

                {isSignUp && (
                  <label className="flex items-start gap-2.5 text-xs leading-5 text-white/50">
                    <input
                      name="termsAccepted"
                      type="checkbox"
                      required
                      className="mt-1 size-3.5 shrink-0 accent-[#766bff]"
                    />
                    <span>
                      I agree to the{" "}
                      <a
                        href="#terms"
                        className="text-[#aaa2ff] underline underline-offset-4"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#privacy"
                        className="text-[#aaa2ff] underline underline-offset-4"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                )}

                <Button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-[#6657f5] text-sm text-white shadow-[0_0_24px_rgba(102,87,245,0.2)] hover:bg-[#786bff]"
                >
                  {isSignUp ? "Create account" : "Sign in"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>

                <p aria-live="polite" className="min-h-5 text-xs text-[#aaa2ff]">
                  {notice}
                </p>
              </form>

              <p className="mt-4 text-center text-sm text-white/50">
                {isSignUp ? "Already have an account?" : "New to HireLoop?"}{" "}
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className="font-medium text-[#aaa2ff] transition-colors hover:text-white"
                >
                  {isSignUp ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}