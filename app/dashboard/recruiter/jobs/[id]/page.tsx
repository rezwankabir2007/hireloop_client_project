"use client"

import { buttonVariants } from "@/components/ui/button"
import { getJob } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/jobs"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type JobRecord = JobFormData & { _id: string }

export default function ViewJobPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<JobRecord | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    getJob(id)
      .then((data: JobRecord) => {
        if (active) setJob(data)
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch job"
          )
        }
      })

    return () => {
      active = false
    }
  }, [id])

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 p-4 sm:p-6">
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
        <Link
          href="/dashboard/recruiter/jobs"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft data-icon="inline-start" />
          Back to jobs
        </Link>
      </div>
    )
  }

  if (!job) {
    return <div className="p-6 text-center">Loading job...</div>
  }

  return (
    <article className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/recruiter/jobs"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back to jobs
          </span>
        </Link>
        <Link
          href={`/dashboard/recruiter/jobs/${encodeURIComponent(id)}/edit`}
          className={buttonVariants()}
        >
          <Pencil data-icon="inline-start" />
          Edit job
        </Link>
      </div>

      <header className="space-y-2 rounded-xl border bg-card p-5 sm:p-6">
        <p className="text-sm font-medium text-primary">{job.category}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
        <p className="text-sm text-muted-foreground">
          {job.type} · {job.remote ? "Remote" : job.location}
        </p>
      </header>

      <section className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="font-semibold">Salary and deadline</h2>
        <p className="text-sm text-muted-foreground">
          {job.currency} {job.salaryMin} – {job.salaryMax}
        </p>
        <p className="text-sm text-muted-foreground">Apply by {job.deadline}</p>
      </section>

      <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="font-semibold">Job description</h2>
        <div>
          <h3 className="text-sm font-medium">Responsibilities</h3>
          <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
            {job.responsibilities}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium">Requirements</h3>
          <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
            {job.requirements}
          </p>
        </div>
        {job.benefits && (
          <div>
            <h3 className="text-sm font-medium">Benefits</h3>
            <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
              {job.benefits}
            </p>
          </div>
        )}
      </section>
    </article>
  )
}
