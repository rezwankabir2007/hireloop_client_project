"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jobFormStyles } from "@/components/jobs/job-form-styles"
import { createJob } from "@/lib/actions/jobs"
import { getJobFormData } from "@/lib/forms/jobs"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function NewJobPage() {
  const router = useRouter()

  // Submit button loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form submit handler
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)

    const jobData = getJobFormData(formData)

    setIsSubmitting(true)
    const toastId = toast.loading("Creating job...")

    try {
      const result = await createJob(jobData)

      console.log("createJob result:", result)

      // শুধু insertedId পাওয়া গেলেই ডানপাশের জব লিস্ট পেজে রিডাইরেক্ট হবে
      if (result?.insertedId) {
        toast.update(toastId, {
          render: "Job created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        })

        // ডানপাশের পেজে রিডাইরেক্ট করার কোড
        router.push("/dashboard/recruiter/jobs")
        router.refresh()
      } else {
        toast.update(toastId, {
          render: "Failed to create job!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error creating job:", error)

      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className={jobFormStyles.page}>
      {/* Page Header */}
      <div className="space-y-3">
        <Link
          href="/dashboard/recruiter/jobs"
          className={jobFormStyles.backLink}
        >
          &larr; Back to jobs
        </Link>

        <div>
          <h1 className={jobFormStyles.pageTitle}>Post a new job</h1>

          <p className={jobFormStyles.pageDescription}>
            Add the details candidates need to learn about this opportunity.
          </p>
        </div>
      </div>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className={jobFormStyles.form}>
        {/* Job Information Section */}
        <section className={jobFormStyles.section}>
          <div>
            <h2 className={jobFormStyles.sectionTitle}>Job information</h2>

            <p className={jobFormStyles.sectionDescription}>
              Start with the title and where the role is based.
            </p>
          </div>

          {/* Job Title */}
          <label className={jobFormStyles.field}>
            Job title
            <Input
              name="title"
              placeholder="e.g. Product Designer"
              required
            />
          </label>

          {/* Category and Job Type */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={jobFormStyles.field}>
              Category
              <Input
                name="category"
                placeholder="e.g. Design"
                required
              />
            </label>

            <label className={jobFormStyles.field}>
              Job type
              <select
                name="type"
                className={jobFormStyles.select}
                defaultValue=""
                required
              >
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

          {/* Location and Remote */}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={jobFormStyles.field}>
              Location
              <Input
                name="location"
                placeholder="e.g. Dhaka, Bangladesh"
                required
              />
            </label>

            <label className={jobFormStyles.remoteField}>
              <input
                name="remote"
                type="checkbox"
                className="size-4 accent-primary"
              />
              This is a remote position
            </label>
          </div>
        </section>

        {/* Salary and Deadline Section */}
        <section className={jobFormStyles.section}>
          <div>
            <h2 className={jobFormStyles.sectionTitle}>Salary and deadline</h2>

            <p className={jobFormStyles.sectionDescription}>
              Share a salary range and the last day to apply.
            </p>
          </div>

          {/* Salary Fields */}
          <div className="grid gap-5 sm:grid-cols-3">
            <label className={jobFormStyles.field}>
              Minimum salary
              <Input
                name="salaryMin"
                type="number"
                min="0"
                placeholder="50000"
                required
              />
            </label>

            <label className={jobFormStyles.field}>
              Maximum salary
              <Input
                name="salaryMax"
                type="number"
                min="0"
                placeholder="80000"
                required
              />
            </label>

            <label className={jobFormStyles.field}>
              Currency
              <select
                name="currency"
                className={jobFormStyles.select}
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

          {/* Application Deadline */}
          <label className={`${jobFormStyles.field} max-w-sm`}>
            Application deadline
            <Input
              name="deadline"
              type="date"
              required
            />
          </label>
        </section>

        {/* Job Description Section */}
        <section className={jobFormStyles.section}>
          <div>
            <h2 className={jobFormStyles.sectionTitle}>Job description</h2>

            <p className={jobFormStyles.sectionDescription}>
              Describe the role, qualifications, and what you offer.
            </p>
          </div>

          {/* Responsibilities */}
          <label className={jobFormStyles.field}>
            Responsibilities
            <textarea
              name="responsibilities"
              className={jobFormStyles.textarea}
              placeholder="What will the successful candidate do?"
              required
            />
          </label>

          {/* Requirements */}
          <label className={jobFormStyles.field}>
            Requirements
            <textarea
              name="requirements"
              className={jobFormStyles.textarea}
              placeholder="What skills or experience are required?"
              required
            />
          </label>

          {/* Benefits */}
          <label className={jobFormStyles.field}>
            Benefits
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
            <textarea
              name="benefits"
              className={jobFormStyles.textarea}
              placeholder="Share benefits or perks for this role"
            />
          </label>
        </section>

        {/* Submit Button */}
        <div className={jobFormStyles.actions}>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating job..." : "Post job"}
          </Button>
        </div>
      </form>
    </div>
  )
}