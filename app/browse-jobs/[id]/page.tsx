"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  createApplication,
  FREE_APPLICATION_LIMIT,
  getApplicationUsage,
} from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import { resolveUserRole } from "@/lib/auth-role"
import { useSession } from "@/lib/auth-client"
import type { JobRecord } from "@/lib/types/jobs"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { toast } from "sonner"

function formatJobType(type: string) {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDeadline(deadline: string) {
  if (!deadline) return ""

  const date = new Date(`${deadline}T00:00:00`)
  if (Number.isNaN(date.getTime())) return deadline

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function getSalaryRange(job: JobRecord) {
  const range = [job.salaryMin, job.salaryMax].filter(Boolean).join(" - ")
  return range ? `${job.currency} ${range}`.trim() : "Salary not specified"
}

function JobFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function DescriptionSection({
  title,
  content,
}: {
  title: string
  content: string
}) {
  if (!content || !content.trim()) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {content}
      </p>
    </section>
  )
}

export default function BrowseJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  // Next.js 15+ params unwrap
  const resolvedParams = use(params)
  const jobId = resolvedParams.id

  const [job, setJob] = useState<JobRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return
      try {
        const jobs: JobRecord[] = await getJobs()
        const foundJob = jobs.find((record) => record._id === jobId)
        setJob(foundJob || null)
      } catch (error) {
        console.error("Failed to fetch job details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">Loading job details...</p>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted/30 px-4">
        <section className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">This job is no longer available</h1>
          <p className="text-sm text-muted-foreground">
            It may have been removed or closed. Browse the latest opportunities
            to find another role.
          </p>
          <Link
            href="/browse-jobs"
            className={buttonVariants({
              className: "bg-violet-600 text-white hover:bg-violet-500",
            })}
          >
            Browse jobs
          </Link>
        </section>
      </main>
    )
  }

  const deadline = formatDeadline(job.deadline)
  const signInUrl = `/sign-in?redirectTo=/browse-jobs/${job._id}`

  // সরাসরি API ডিল করার ফাংশন
  const handleApplyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // ১. ইউজার সাইন-ইন করা না থাকলে
    if (!user) {
      toast.error("Please sign in to apply for this job")
      router.push(signInUrl)
      return
    }

    // ২. ইউজার Seeker না হলে
    if (resolveUserRole(user.role, user.requestedRole) !== "seeker") {
      toast.error("Only job seekers can apply for jobs.")
      return
    }

    setApplying(true)

    const applicationPayload = {
      jobId: job._id,
      userId: user.id,
      applicantName: user.name || user.email,
      email: user.email,
      jobTitle: job.title,
      companyName: job.companyName || "Not specified",
      jobCategory: job.category,
      jobType: job.type,
      location: job.location,
      remote: job.remote,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: job.currency,
      deadline: job.deadline,
      appliedAt: new Date().toISOString(),
      status: "pending" as const,
    }

    try {
      const usage = await getApplicationUsage(user.id)
      if (!usage.isPremium && usage.count >= FREE_APPLICATION_LIMIT) {
        toast.info("You have reached the 10-application free limit.")
        router.push("/pricing")
        return
      }

      await createApplication(applicationPayload)
      toast.success("Application submitted successfully!")
      router.push("/browse-jobs")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your application."
      )
    } finally {
      setApplying(false)
    }
  }

  const ApplyLinks = (
    <button
      type="button"
      onClick={handleApplyClick}
      disabled={applying}
      className={buttonVariants({
        className:
          "h-10 w-auto bg-violet-600 text-white hover:bg-violet-500 justify-center cursor-pointer disabled:opacity-50",
      })}
    >
      {applying ? "Applying..." : "Apply for this job"}
    </button>
  )

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-violet-500"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to jobs
        </Link>

        <header className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 size-72 rounded-full bg-violet-500/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4 items-start">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                <BriefcaseBusiness aria-hidden="true" className="size-7" />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm font-semibold text-violet-500">
                  {job.category}
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500">
                    {formatJobType(job.type)}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {job.remote ? "Remote" : "On-site"}
                  </span>
                </div>
              </div>
            </div>

            <div>{ApplyLinks}</div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <DescriptionSection
              title="About the role"
              content={job.responsibilities}
            />
            <DescriptionSection
              title="What we're looking for"
              content={job.requirements}
            />
            <DescriptionSection title="Benefits" content={job.benefits} />
          </article>

          <aside className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-6">
            <div>
              <h2 className="text-lg font-semibold">Job overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Key details about this opportunity
              </p>
            </div>

            <div className="space-y-5 border-t pt-5">
              <JobFact
                icon={MapPin}
                label="Location"
                value={job.location || "Not specified"}
              />
              <JobFact
                icon={BriefcaseBusiness}
                label="Employment type"
                value={formatJobType(job.type)}
              />
              <JobFact
                icon={DollarSign}
                label="Salary range"
                value={getSalaryRange(job)}
              />
              <JobFact
                icon={CheckCircle2}
                label="Work arrangement"
                value={job.remote ? "Remote" : "On-site"}
              />
              {deadline && (
                <JobFact
                  icon={CalendarDays}
                  label="Application deadline"
                  value={deadline}
                />
              )}
              <JobFact
                icon={Clock3}
                label="Application status"
                value="Open"
              />
            </div>

            <div className="pt-2">{ApplyLinks}</div>
          </aside>
        </div>
      </div>
    </main>
  )
}