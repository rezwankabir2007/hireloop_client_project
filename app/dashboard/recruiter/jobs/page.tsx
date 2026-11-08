"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteJob as deleteJobRequest, getJobs } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/jobs"
import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type JobStatus = "Active" | "Closed" | "Draft"

type ManagedJob = JobFormData & {
  _id: string
  status: JobStatus
  applicants: number
  postedAt: string
}

const activeJobLimit = 10

// সুরক্ষিত formatDate ফাংশন (Invalid Date এড়ানোর জন্য)
function formatDate(date: string) {
  if (!date) return "N/A"

  const parsedDate = new Date(date.includes("T") ? date : `${date}T00:00:00Z`)

  if (isNaN(parsedDate.getTime())) {
    return "N/A"
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsedDate)
}

function formatJobType(type: string) {
  if (!type) return ""
  return type
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, string> = {
    Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Closed: "bg-muted text-muted-foreground",
    Draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function ManageJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<ManagedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All")
  const [deleteTarget, setDeleteTarget] = useState<ManagedJob | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const activeJobs = jobs.filter((job) => job.status === "Active").length
  const totalApplicants = jobs.reduce(
    (total, job) => total + (job.applicants || 0),
    0
  )

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [job.title, job.category, job.type, job.location].some((value) =>
          value?.toLowerCase().includes(query)
        )
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [jobs, search, statusFilter])

  function updateJobStatus(jobId: string, status: JobStatus) {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job._id === jobId ? { ...job, status } : job))
    )
  }

  async function confirmDeleteJob() {
    if (!deleteTarget) return

    setDeleting(true)
    setDeleteError("")

    try {
      await deleteJobRequest(deleteTarget._id)
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== deleteTarget._id)
      )
      setDeleteTarget(null)
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete job"
      )
    } finally {
      setDeleting(false)
    }
  }

  function getStatusAction(job: ManagedJob) {
    if (job.status === "Draft") {
      return { label: "Publish", nextStatus: "Active" as const }
    }
    if (job.status === "Active") {
      return { label: "Close", nextStatus: "Closed" as const }
    }
    return { label: "Reopen", nextStatus: "Active" as const }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading jobs...</div>
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Recruiter workspace
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Manage jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of your job posts and applicants in one place.
          </p>
        </div>
        <Button
          disabled={activeJobs >= activeJobLimit}
          onClick={() => router.push("/dashboard/recruiter/jobs/new")}
        >
          <Plus data-icon="inline-start" />
          Post a job
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Job overview">
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total job posts</p>
            <BriefcaseBusiness className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{jobs.length}</p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active jobs</p>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{activeJobs}</p>
        </article>
        <article className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total applicants</p>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{totalApplicants}</p>
        </article>
      </section>

      <section className="space-y-3 rounded-xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">Plan usage</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Active job posts on your current plan
            </p>
          </div>
          <p className="text-sm font-medium">
            {activeJobs}{" "}
            <span className="text-muted-foreground">/ {activeJobLimit}</span>
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Active job posts used"
          aria-valuemin={0}
          aria-valuemax={activeJobLimit}
          aria-valuenow={activeJobs}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{
              width: `${Math.min((activeJobs / activeJobLimit) * 100, 100)}%`,
            }}
          />
        </div>
        {activeJobs >= activeJobLimit && (
          <p className="text-sm text-destructive">
            You have reached your plan&apos;s active job limit.
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-semibold">Your job posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
              {statusFilter !== "All" ? ` · ${statusFilter}` : ""}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search jobs"
                aria-label="Search jobs"
                className="pl-9"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.currentTarget.value as JobStatus | "All")
              }
              aria-label="Filter jobs by status"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-medium">No jobs found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <caption className="sr-only">Your job posts</caption>
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Job title
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Applicants
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Date posted
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-right font-medium"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredJobs.map((job) => {
                    const statusAction = getStatusAction(job)
                    return (
                      <tr
                        key={job._id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <th scope="row" className="px-5 py-4 font-normal">
                          <p className="font-medium text-foreground">
                            {job.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {job.category} · {formatJobType(job.type)}
                          </p>
                        </th>
                        <td className="px-4 py-4">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {job.applicants}
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {formatDate(job.postedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateJobStatus(
                                  job._id,
                                  statusAction.nextStatus
                                )
                              }
                            >
                              {statusAction.label}
                            </Button>
                            <Link
                              href={`/dashboard/recruiter/jobs/${encodeURIComponent(job._id)}`}
                              aria-label={`View ${job.title}`}
                              title="View job"
                              className={buttonVariants({
                                variant: "ghost",
                                size: "icon-sm",
                              })}
                            >
                              <Eye className="size-4" />
                            </Link>
                            <Link
                              href={`/dashboard/recruiter/jobs/${encodeURIComponent(job._id)}/edit`}
                              aria-label={`Edit ${job.title}`}
                              title="Edit job"
                              className={buttonVariants({
                                variant: "ghost",
                                size: "icon-sm",
                              })}
                            >
                              <Pencil className="size-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${job.title}`}
                              title="Delete job"
                              onClick={() => {
                                setDeleteError("")
                                setDeleteTarget(job)
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y md:hidden">
              {filteredJobs.map((job) => {
                const statusAction = getStatusAction(job)
                return (
                  <li key={job._id} className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.category} · {formatJobType(job.type)}
                        </p>
                      </div>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {job.remote ? "Remote" : job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-4" />
                        {job.applicants} applicants
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {formatDate(job.postedAt)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateJobStatus(job._id, statusAction.nextStatus)
                        }
                      >
                        {statusAction.label}
                      </Button>
                      <Link
                        href={`/dashboard/recruiter/jobs/${encodeURIComponent(job._id)}`}
                        aria-label={`View ${job.title}`}
                        title="View job"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-sm",
                        })}
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        href={`/dashboard/recruiter/jobs/${encodeURIComponent(job._id)}/edit`}
                        aria-label={`Edit ${job.title}`}
                        title="Edit job"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-sm",
                        })}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${job.title}`}
                        title="Delete job"
                        onClick={() => {
                          setDeleteError("")
                          setDeleteTarget(job)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-job-title"
            aria-describedby="delete-job-description"
            className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 shadow-lg"
          >
            <div className="space-y-2">
              <h2 id="delete-job-title" className="text-lg font-semibold">
                Delete job?
              </h2>
              <p
                id="delete-job-description"
                className="text-sm text-muted-foreground"
              >
                Are you sure you want to delete “{deleteTarget.title}”? This
                action cannot be undone.
              </p>
            </div>
            {deleteError && (
              <p role="alert" className="text-sm text-destructive">
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={confirmDeleteJob}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
