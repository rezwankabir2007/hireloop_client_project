import type { JobFormData } from "@/lib/types/jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`)

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.statusText}`)
  }

  return res.json()
}

export const getJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch job: ${res.statusText}`)
  }

  return res.json()
}

export const updateJob = async (jobId: string, data: JobFormData) => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Failed to update job: ${res.statusText}`)
  }
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error(`Failed to delete job: ${res.statusText}`)
  }
}
