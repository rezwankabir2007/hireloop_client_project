"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { JobFormData } from "@/lib/types/jobs"
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

type JobStatus = "Active" | "Closed" | "Draft"

type ManagedJob = JobFormData & {
  id: string
  status: JobStatus
  applicants: number
  postedAt: string
}

const initialJobs: ManagedJob[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    category: "Design",
    type: "full-time",
    location: "Dhaka, Bangladesh",
    remote: false,
    salaryMin: "90000",
    salaryMax: "130000",
    currency: "BDT",
    deadline: "2026-12-15",
    responsibilities: "Lead product design from research through delivery.",
    requirements: "5+ years of product design experience.",
    benefits: "Health coverage and flexible hours.",
    status: "Active",
    applicants: 24,
    postedAt: "2026-11-02",
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    category: "Engineering",
    type: "full-time",
    location: "Remote",
    remote: true,
    salaryMin: "5000",
    salaryMax: "7500",
    currency: "USD",
    deadline: "2026-12-20",
    responsibilities: "Build and maintain accessible web experiences.",
    requirements: "Experience with React and TypeScript.",
    benefits: "Remote-first team and learning budget.",
    status: "Active",
    applicants: 38,
    postedAt: "2026-10-28",
  },
  {
    id: "job-3",
    title: "Talent Acquisition Associate",
    category: "Human Resources",
    type: "contract",
    location: "Dhaka, Bangladesh",
    remote: false,
    salaryMin: "45000",
    salaryMax: "65000",
    currency: "BDT",
    deadline: "2026-11-30",
    responsibilities: "Coordinate interviews and support hiring teams.",
    requirements: "Strong communication and organizational skills.",
    benefits: "",
    status: "Closed",
    applicants: 17,
    postedAt: "2026-10-10",
  },
  {
    id: "job-4",
    title: "Marketing Intern",
    category: "Marketing",
    type: "internship",
    location: "Chattogram, Bangladesh",
    remote: false,
    salaryMin: "12000",
    salaryMax: "18000",
    currency: "BDT",
    deadline: "2026-12-01",
    responsibilities: "Help create content and support marketing campaigns.",
    requirements: "Interest in digital marketing and social media.",
    benefits: "Mentorship and hands-on experience.",
    status: "Draft",
    applicants: 0,
    postedAt: "2026-11-05",
  },
]

const activeJobLimit = 10

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function formatJobType(type: string) {
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
  const [jobs, setJobs] = useState(initialJobs)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All")

  const activeJobs = jobs.filter((job) => job.status === "Active").length
  const totalApplicants = jobs.reduce((total, job) => total + job.applicants, 0)
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [job.title, job.category, job.type, job.location].some((value) =>
          value.toLowerCase().includes(query)
        )
      const matchesStatus = statusFilter === "All" || job.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [jobs, search, statusFilter])

  function updateJobStatus(jobId: string, status: JobStatus) {
    setJobs((currentJobs) =>
      currentJobs.map((job) => (job.id === jobId ? { ...job, status } : job))
    )
  }

  function deleteJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId)
    if (!job || !window.confirm(`Delete “${job.title}”? This cannot be undone.`)) {
      return
    }

    setJobs((currentJobs) => currentJobs.filter((item) => item.id !== jobId))
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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Recruiter workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Manage jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep track of your job posts and applicants in one place.
          </p>
        </div>
        <Button
          render={<Link href="/dashboard/recruiter/jobs/new" />}
          disabled={activeJobs >= activeJobLimit}
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
            {activeJobs} <span className="text-muted-foreground">/ {activeJobLimit}</span>
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
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredJobs.map((job) => {
                    const statusAction = getStatusAction(job)
                    return (
                      <tr key={job.id} className="transition-colors hover:bg-muted/20">
                        <th scope="row" className="px-5 py-4 font-normal">
                          <p className="font-medium text-foreground">{job.title}</p>
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
                                updateJobStatus(job.id, statusAction.nextStatus)
                              }
                            >
                              {statusAction.label}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${job.title}`}
                              onClick={() => deleteJob(job.id)}
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
                  <li key={job.id} className="space-y-4 p-4">
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
                          updateJobStatus(job.id, statusAction.nextStatus)
                        }
                      >
                        {statusAction.label}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${job.title}`}
                        onClick={() => deleteJob(job.id)}
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
    </div>
  )
}
