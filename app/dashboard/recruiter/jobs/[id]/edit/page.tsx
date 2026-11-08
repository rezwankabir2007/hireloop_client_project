"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJob, updateJob } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/jobs"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"

type JobRecord = JobFormData & { _id: string }

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<JobRecord | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSaving(true)

    const formData = new FormData(event.currentTarget)
    const jobData: JobFormData = {
      title: getTextField(formData, "title"),
      category: getTextField(formData, "category"),
      type: getTextField(formData, "type"),
      location: getTextField(formData, "location"),
      remote: formData.has("remote"),
      salaryMin: getTextField(formData, "salaryMin"),
      salaryMax: getTextField(formData, "salaryMax"),
      currency: getTextField(formData, "currency"),
      deadline: getTextField(formData, "deadline"),
      responsibilities: getTextField(formData, "responsibilities"),
      requirements: getTextField(formData, "requirements"),
      benefits: getTextField(formData, "benefits"),
    }

    try {
      await updateJob(id, jobData)
      router.push("/dashboard/recruiter/jobs")
      router.refresh()
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to update job"
      )
    } finally {
      setSaving(false)
    }
  }

  if (error && !job) {
    return (
      <p role="alert" className="p-6 text-sm text-destructive">
        {error}
      </p>
    )
  }

  if (!job) {
    return <div className="p-6 text-center">Loading job...</div>
  }

  const fieldClassName =
    "flex flex-col gap-2 text-sm font-medium text-foreground"
  const selectClassName =
    "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
  const textareaClassName =
    "min-h-28 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="space-y-3">
        <Link
          href={`/dashboard/recruiter/jobs/${encodeURIComponent(id)}`}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to job
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit job</h1>
          <p className="mt-1 text-sm text-muted-foreground">{job.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Job information</h2>
          <label className={fieldClassName}>
            Job title
            <Input name="title" defaultValue={job.title} required />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={fieldClassName}>
              Category
              <Input name="category" defaultValue={job.category} required />
            </label>
            <label className={fieldClassName}>
              Job type
              <select
                name="type"
                className={selectClassName}
                defaultValue={job.type}
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={fieldClassName}>
              Location
              <Input name="location" defaultValue={job.location} required />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                name="remote"
                type="checkbox"
                defaultChecked={job.remote}
                className="size-4 accent-primary"
              />
              This is a remote position
            </label>
          </div>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Salary and deadline</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className={fieldClassName}>
              Minimum salary
              <Input
                name="salaryMin"
                type="number"
                min="0"
                defaultValue={job.salaryMin}
                required
              />
            </label>
            <label className={fieldClassName}>
              Maximum salary
              <Input
                name="salaryMax"
                type="number"
                min="0"
                defaultValue={job.salaryMax}
                required
              />
            </label>
            <label className={fieldClassName}>
              Currency
              <select
                name="currency"
                className={selectClassName}
                defaultValue={job.currency}
                required
              >
                <option value="USD">USD</option>
                <option value="BDT">BDT</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>
          <label className={`${fieldClassName} max-w-sm`}>
            Application deadline
            <Input
              name="deadline"
              type="date"
              defaultValue={job.deadline}
              required
            />
          </label>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Job description</h2>
          <label className={fieldClassName}>
            Responsibilities
            <textarea
              name="responsibilities"
              className={textareaClassName}
              defaultValue={job.responsibilities}
              required
            />
          </label>
          <label className={fieldClassName}>
            Requirements
            <textarea
              name="requirements"
              className={textareaClassName}
              defaultValue={job.requirements}
              required
            />
          </label>
          <label className={fieldClassName}>
            Benefits{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
            <textarea
              name="benefits"
              className={textareaClassName}
              defaultValue={job.benefits}
            />
          </label>
        </section>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
