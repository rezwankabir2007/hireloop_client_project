"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowLeft, Check, Crown, Sparkles, X, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const searchParams = useSearchParams()
  const canceled = searchParams.get("canceled")

  useEffect(() => {
    if (canceled) {
      console.log(
        "Order canceled -- continue to shop around and check out when you're ready."
      )
    }
  }, [canceled])

  // Checkout ফাংশন
  const handleCheckout = async () => {
    try {
      setLoading(true)
      setErrorMsg("")

      // সঠিক API রাউট /api/checkout_sessions ব্যবহার করা হয়েছে
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", price: 20 }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Checkout session তৈরি করা যায়নি।")
      }

      // Stripe বা পেমেন্ট গেটওয়ের URL-এ রিডাইরেক্ট করবে
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Payment gateway এখনো কানেক্ট করা হয়নি।"
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        {/* Back Link */}
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-violet-500"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to jobs
        </Link>

        {/* পেমেন্ট ক্যানসেল করলে এই মেসেজ দেখাবে */}
        {canceled && (
          <div className="mx-auto max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-700 dark:text-amber-300">
            Order canceled — continue to browse jobs and check out whenever you&apos;re ready.
          </div>
        )}

        {/* Header Section */}
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Sparkles aria-hidden="true" className="size-6" />
          </span>
          <p className="text-sm font-semibold tracking-wide text-violet-600 uppercase dark:text-violet-400">
            HireLoop Membership
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Keep moving your career forward
          </h1>
          <p className="text-muted-foreground">
            You&apos;ve reached your limit of 10 free job applications. Upgrade
            to Pro for unlimited applications and priority visibility.
          </p>
        </header>

        {/* Pricing Cards Grid */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free Tier Card */}
          <section className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Starter</h2>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Current Plan
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Basic access to explore and apply to jobs.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">$0</span>
                <span className="text-sm text-muted-foreground">/forever</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-emerald-500" />
                  <span>Up to 10 job applications</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-emerald-500" />
                  <span>Standard job search & filtering</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <X className="size-4 shrink-0 text-muted-foreground/60" />
                  <span>Unlimited applications</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <X className="size-4 shrink-0 text-muted-foreground/60" />
                  <span>Featured applicant badge</span>
                </li>
              </ul>
            </div>

            <Link
              href="/browse-jobs"
              className={`${buttonVariants({ variant: "outline" })} mt-8 w-full`}
            >
              Continue Browsing
            </Link>
          </section>

          {/* Premium Tier Card */}
          <section
            aria-labelledby="premium-plan"
            className="relative flex flex-col justify-between rounded-2xl border-2 border-violet-600 bg-card p-6 shadow-xl shadow-violet-500/10 sm:p-8"
          >
            <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Crown className="size-3.5" />
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="premium-plan" className="text-xl font-semibold">
                    HireLoop Pro
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Everything you need to land your next role faster.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">$20</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-violet-500" />
                  <span className="font-medium">
                    Unlimited job applications
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-violet-500" />
                  <span>Priority profile visibility to recruiters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-violet-500" />
                  <span>Application status tracking & insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-violet-500" />
                  <span>Cancel anytime with one click</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-violet-600 text-white hover:bg-violet-500"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to Pro — $20/mo"
                )}
              </Button>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400"
                >
                  {errorMsg}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}