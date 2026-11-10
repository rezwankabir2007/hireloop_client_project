import { buttonVariants } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import type { JobRecord } from "@/lib/types/jobs"
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
  if (!content.trim()) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {content}
      </p>
    </section>
  )
}

export default async function BrowseJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const jobs: JobRecord[] = await getJobs()
  const job = jobs.find((record) => record._id === id)

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
              className:
                "bg-violet-600 text-white hover:bg-violet-500",
            })}
          >
            Browse jobs
          </Link>
        </section>
      </main>
    )
  }

  const deadline = formatDeadline(job.deadline)

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
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
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

            <Link
              href="/sign-in"
              className={buttonVariants({
                className:
                  "h-10 shrink-0 bg-violet-600 px-5 text-white hover:bg-violet-500",
              })}
            >
              Apply for this job
            </Link>
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

            <Link
              href="/sign-in"
              className={buttonVariants({
                className:
                  "h-10 w-full bg-violet-600 text-white hover:bg-violet-500",
              })}
            >
              Apply for this job
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
