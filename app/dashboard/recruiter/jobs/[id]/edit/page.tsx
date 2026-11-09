"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jobFormStyles } from "@/components/jobs/job-form-styles"
import { getJob, updateJob } from "@/lib/api/jobs"
import { getJobFormData } from "@/lib/forms/jobs"
import type { JobRecord } from "@/lib/types/jobs"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"

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
    const jobData = getJobFormData(formData)

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

  return (
    <div className={jobFormStyles.page}>
      <div className="space-y-3">
        <Link
          href={`/dashboard/recruiter/jobs/${encodeURIComponent(id)}`}
          className={jobFormStyles.backLink}
        >
          &larr; Back to job
        </Link>
        <div>
          <h1 className={jobFormStyles.pageTitle}>Edit job</h1>
          <p className={jobFormStyles.pageDescription}>{job.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={jobFormStyles.form}>
        <section className={jobFormStyles.section}>
          <h2 className={jobFormStyles.sectionTitle}>Job information</h2>
          <label className={jobFormStyles.field}>
            Job title
            <Input name="title" defaultValue={job.title} required />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={jobFormStyles.field}>
              Category
              <Input name="category" defaultValue={job.category} required />
            </label>
            <label className={jobFormStyles.field}>
              Job type
              <select
                name="type"
                className={jobFormStyles.select}
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
            <label className={jobFormStyles.field}>
              Location
              <Input name="location" defaultValue={job.location} required />
            </label>
            <label className={jobFormStyles.remoteField}>
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

        <section className={jobFormStyles.section}>
          <h2 className={jobFormStyles.sectionTitle}>Salary and deadline</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className={jobFormStyles.field}>
              Minimum salary
              <Input
                name="salaryMin"
                type="number"
                min="0"
                defaultValue={job.salaryMin}
                required
              />
            </label>
            <label className={jobFormStyles.field}>
              Maximum salary
              <Input
                name="salaryMax"
                type="number"
                min="0"
                defaultValue={job.salaryMax}
                required
              />
            </label>
            <label className={jobFormStyles.field}>
              Currency
              <select
                name="currency"
                className={jobFormStyles.select}
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
          <label className={`${jobFormStyles.field} max-w-sm`}>
            Application deadline
            <Input
              name="deadline"
              type="date"
              defaultValue={job.deadline}
              required
            />
          </label>
        </section>

        <section className={jobFormStyles.section}>
          <h2 className={jobFormStyles.sectionTitle}>Job description</h2>
          <label className={jobFormStyles.field}>
            Responsibilities
            <textarea
              name="responsibilities"
              className={jobFormStyles.textarea}
              defaultValue={job.responsibilities}
              required
            />
          </label>
          <label className={jobFormStyles.field}>
            Requirements
            <textarea
              name="requirements"
              className={jobFormStyles.textarea}
              defaultValue={job.requirements}
              required
            />
          </label>
          <label className={jobFormStyles.field}>
            Benefits{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
            <textarea
              name="benefits"
              className={jobFormStyles.textarea}
              defaultValue={job.benefits}
            />
          </label>
        </section>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className={jobFormStyles.actions}>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
