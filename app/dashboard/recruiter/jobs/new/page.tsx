"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createJob } from "@/lib/actions/jobs"
import Link from "next/link"
import { useState, useEffect, type FormEvent } from "react"

export type JobFormData = {
  title: string
  category: string
  type: string
  location: string
  remote: boolean
  salaryMin: string
  salaryMax: string
  currency: string
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
}

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export default function NewJobPage() {
  const [submittedJob, setSubmittedJob] = useState<JobFormData | null>(null)

  // State update hole automatic console-e show korbe
  useEffect(() => {
    if (submittedJob) {
      console.log("Submitted Job State Updated:", submittedJob)
    }
  }, [submittedJob])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

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
      const result = await createJob(jobData)
      console.log("createJob result:", result)
    } catch (error) {
      console.error("Error creating job:", error)
    }

    setSubmittedJob(jobData)
  }

  const fieldClassName =
    "flex flex-col gap-2 text-sm font-medium text-foreground"
  const textareaClassName =
    "min-h-28 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
  const selectClassName =
    "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="space-y-3">
        <Link
          href="/dashboard/recruiter/jobs"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to jobs
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Post a new job</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the details candidates need to learn about this opportunity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Job information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with the title and where the role is based.
            </p>
          </div>

          <label className={fieldClassName}>
            Job title
            <Input name="title" placeholder="e.g. Product Designer" required />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={fieldClassName}>
              Category
              <Input name="category" placeholder="e.g. Design" required />
            </label>
            <label className={fieldClassName}>
              Job type
              <select name="type" className={selectClassName} defaultValue="" required>
                <option value="" disabled>
                  Select a job type
                </option>
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
              <Input name="location" placeholder="e.g. Dhaka, Bangladesh" required />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input
                name="remote"
                type="checkbox"
                className="size-4 accent-primary"
              />
              This is a remote position
            </label>
          </div>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Salary and deadline</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share a salary range and the last day to apply.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className={fieldClassName}>
              Minimum salary
              <Input
                name="salaryMin"
                type="number"
                min="0"
                placeholder="50000"
                required
              />
            </label>
            <label className={fieldClassName}>
              Maximum salary
              <Input
                name="salaryMax"
                type="number"
                min="0"
                placeholder="80000"
                required
              />
            </label>
            <label className={fieldClassName}>
              Currency
              <select
                name="currency"
                className={selectClassName}
                defaultValue="USD"
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
            <Input name="deadline" type="date" required />
          </label>
        </section>

        <section className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
          <div>
            <h2 className="font-semibold">Job description</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Describe the role, qualifications, and what you offer.
            </p>
          </div>

          <label className={fieldClassName}>
            Responsibilities
            <textarea
              name="responsibilities"
              className={textareaClassName}
              placeholder="What will the successful candidate do?"
              required
            />
          </label>
          <label className={fieldClassName}>
            Requirements
            <textarea
              name="requirements"
              className={textareaClassName}
              placeholder="What skills or experience are required?"
              required
            />
          </label>
          <label className={fieldClassName}>
            Benefits <span className="font-normal text-muted-foreground">(optional)</span>
            <textarea
              name="benefits"
              className={textareaClassName}
              placeholder="Share benefits or perks for this role"
            />
          </label>
        </section>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Preview job
          </Button>
        </div>
      </form>

      {submittedJob && (
        <section
          aria-live="polite"
          className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-5"
        >
          <h2 className="text-lg font-semibold">{submittedJob.title}</h2>
          <p className="text-sm text-muted-foreground">
            {submittedJob.category} · {submittedJob.type} ·{" "}
            {submittedJob.remote ? "Remote" : submittedJob.location}
          </p>
          <p className="text-sm">
            Salary: {submittedJob.currency} {submittedJob.salaryMin} –{" "}
            {submittedJob.salaryMax}
          </p>
          <p className="text-sm text-muted-foreground">
            Apply by {submittedJob.deadline}
          </p>
          <p className="pt-2 text-sm text-muted-foreground">
            This preview is in the browser only; the job has not been saved or
            published.
          </p>
        </section>
      )}
    </div>
  )
}