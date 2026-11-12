"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { getApplications } from "@/lib/api/applications"
import { useSession } from "@/lib/auth-client"
import { resolveUserRole } from "@/lib/auth-role"
import type { ApplicationRecord } from "@/lib/types/applications"
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ApplicationFilter = "all" | "reviewing" | "interview" | "accepted" | "rejected"

const filters: { id: ApplicationFilter; label: string }[] = [
  { id: "all", label: "All applications" },
  { id: "reviewing", label: "In review" },
  { id: "interview", label: "Interview" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Not selected" },
]

function normalizedStatus(status?: string) {
  return (status || "pending").trim().toLowerCase().replace(/[\s-]+/g, "_")
}

function statusLabel(status?: string) {
  const normalized = normalizedStatus(status)
  const labels: Record<string, string> = {
    pending: "Submitted",
    applied: "Submitted",
    submitted: "Submitted",
    reviewing: "In review",
    under_review: "In review",
    shortlisted: "Shortlisted",
    interview: "Interview",
    interview_scheduled: "Interview",
    accepted: "Accepted",
    offer: "Offer",
    rejected: "Not selected",
    withdrawn: "Withdrawn",
  }

  return (
    labels[normalized] ||
    normalized.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  )
}

function statusStyle(status?: string) {
  const normalized = normalizedStatus(status)

  if (["accepted", "offer"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  }
  if (["rejected", "withdrawn"].includes(normalized)) {
    return "bg-muted text-muted-foreground"
  }
  if (["interview", "interview_scheduled", "shortlisted"].includes(normalized)) {
    return "bg-violet-500/10 text-violet-700 dark:text-violet-400"
  }
  return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Date not available"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function matchesFilter(application: ApplicationRecord, filter: ApplicationFilter) {
  if (filter === "all") return true

  const status = normalizedStatus(application.status)
  if (filter === "reviewing") {
    return ["pending", "applied", "submitted", "reviewing", "under_review", "shortlisted"].includes(
      status
    )
  }
  if (filter === "interview") {
    return ["interview", "interview_scheduled"].includes(status)
  }
  if (filter === "accepted") return ["accepted", "offer"].includes(status)
  return ["rejected", "withdrawn"].includes(status)
}

export default function ApplicationsPage() {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const userId = user?.id
  const userRole = resolveUserRole(user?.role, user?.requestedRole)

  // 1. সব হুকস (Hooks) একদম উপরে ডিক্লেয়ার করা হলো
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<ApplicationFilter>("all")
  const [search, setSearch] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (isPending || !userId) return

    const controller = new AbortController()
    getApplications(userId, controller.signal)
      .then((records) => {
        setApplications(records)
        setError("")
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load your applications."
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [isPending, reloadKey, userId])

  const visibleApplications = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        [application.jobTitle, application.companyName, application.location]
          .some((value) => value?.toLowerCase().includes(query))

      return matchesSearch && matchesFilter(application, filter)
    })
  }, [applications, filter, search])

  const inReviewCount = applications.filter((application) =>
    matchesFilter(application, "reviewing")
  ).length
  const interviewCount = applications.filter((application) =>
    matchesFilter(application, "interview")
  ).length
  const acceptedCount = applications.filter((application) =>
    matchesFilter(application, "accepted")
  ).length

  // 2. হুকস ডিক্লেয়ার করার পর এখন কন্ডিশনাল চেক বা আর্লি রিটার্ন দেওয়া যাবে
  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 text-center">
        <p className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Checking authentication session...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <section className="space-y-4 rounded-2xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-semibold">Sign in to view applications</h1>
          <p className="text-sm text-muted-foreground">
            Your submitted applications are available from your seeker account.
          </p>
          <Link
            href="/sign-in?redirectTo=/dashboard/seeker/applications"
            className={buttonVariants()}
          >
            Sign in
          </Link>
        </section>
      </div>
    )
  }

  if (userRole !== "seeker") {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <p role="alert" className="rounded-xl border bg-card p-6 text-sm">
          This page is available to job seekers.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
            Seeker dashboard
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My applications
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Keep track of the roles you have applied for and their latest status.
          </p>
        </div>
        <Link
          href="/browse-jobs"
          className={buttonVariants({
            className: "bg-violet-600 text-white hover:bg-violet-500",
          })}
        >
          <Search data-icon="inline-start" />
          Browse jobs
        </Link>
      </header>

      <section aria-label="Application summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total applications", value: applications.length },
          { label: "In review", value: inReviewCount },
          { label: "Interviews", value: interviewCount },
          { label: "Offers", value: acceptedCount },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Application activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {applications.length} {applications.length === 1 ? "application" : "applications"}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles or companies"
              aria-label="Search applications"
              className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b pb-3">
          {filters.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={filter === item.id ? "secondary" : "ghost"}
              className="shrink-0"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {error ? (
          <div
            role="alert"
            className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setError("")
                setLoading(true)
                setReloadKey((key) => key + 1)
              }}
            >
              Try again
            </Button>
          </div>
        ) : loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <div className="space-y-4 py-10 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness aria-hidden="true" className="size-5 text-muted-foreground" />
            </span>
            <div className="space-y-1">
              <h3 className="font-semibold">No applications yet</h3>
              <p className="text-sm text-muted-foreground">
                Once you apply for a job, it will appear here.
              </p>
            </div>
            <Link href="/browse-jobs" className={buttonVariants({ variant: "outline" })}>
              Explore jobs
            </Link>
          </div>
        ) : visibleApplications.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No applications match your search and status filter.
          </p>
        ) : (
          <div className="divide-y">
            {visibleApplications.map((application, index) => (
              <article
                key={application._id || `${application.jobId}-${index}`}
                className="flex flex-col gap-4 py-5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <BriefcaseBusiness aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{application.jobTitle}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(application.status)}`}
                      >
                        {statusLabel(application.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {application.companyName || "Company not specified"}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" className="size-3.5" />
                        {application.location || "Location not specified"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays aria-hidden="true" className="size-3.5" />
                        Applied {formatDate(application.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/browse-jobs/${encodeURIComponent(application.jobId)}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full sm:w-auto",
                  })}
                >
                  View job
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}