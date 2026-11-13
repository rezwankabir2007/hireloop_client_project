import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams

  if (!sessionId) notFound()

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  })

  if (session.status === "open") redirect("/pricing")
  if (session.status !== "complete" || session.payment_status !== "paid") {
    redirect("/pricing")
  }

  await checkoutVerify(sessionId)

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id
  const currency = session.currency?.toUpperCase()
  const amountFormatter = currency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency })
    : null
  const fractionDigits =
    amountFormatter?.resolvedOptions().maximumFractionDigits ?? 2
  const totalPaid =
    session.amount_total !== null && amountFormatter
      ? amountFormatter.format(
          session.amount_total / 10 ** fractionDigits,
        )
      : null
  const checkoutDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(session.created * 1000))
  const customerEmail =
    session.customer_details?.email ?? session.customer_email

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-2xl">
        <section
          aria-labelledby="payment-success-title"
          className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-foreground/5"
        >
          <header className="border-b bg-emerald-500/5 px-6 py-10 text-center sm:px-10">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 aria-hidden="true" className="size-9" />
            </div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Payment confirmed
            </p>
            <h1
              id="payment-success-title"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Thank you for your purchase
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Your payment was successful. Keep this page for your transaction
              details.
            </p>
          </header>

          <div className="space-y-6 p-6 sm:p-10">
            <dl className="divide-y rounded-2xl border bg-muted/20 px-5">
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="text-sm text-muted-foreground">Payment status</dt>
                <dd className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Paid
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="text-sm text-muted-foreground">Total paid</dt>
                <dd className="text-lg font-semibold">
                  {totalPaid ?? "Unavailable"}
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="text-sm text-muted-foreground">Transaction ID</dt>
                <dd className="break-all text-left font-mono text-sm font-medium sm:max-w-[65%] sm:text-right">
                  {transactionId ?? "Unavailable"}
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <dt className="text-sm text-muted-foreground">Checkout date</dt>
                <dd className="text-sm font-medium">{checkoutDate}</dd>
              </div>
              {customerEmail ? (
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <dt className="text-sm text-muted-foreground">
                    Receipt email
                  </dt>
                  <dd className="break-all text-sm font-medium sm:text-right">
                    {customerEmail}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="text-center text-sm text-muted-foreground">
              A receipt will be sent to your email if one was provided at
              checkout.
            </p>

            <div className="flex justify-center">
              <Link
                className={buttonVariants({
                  className:
                    "bg-violet-600 text-white hover:bg-violet-500",
                })}
                href="/browse-jobs"
              >
                Back to browse jobs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
