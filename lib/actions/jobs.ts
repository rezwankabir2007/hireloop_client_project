"use server"

import { auth } from "@/lib/auth"
import type { JobFormData } from "@/lib/types/jobs"
import { headers } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = '') => {
  // query খালি না থাকলে ? সহ যুক্ত হবে, না হলে শুধু /jobs হবে
  const url = query ? `${BASE_URL}/jobs?${query}` : `${BASE_URL}/jobs`

  const res = await fetch(url, {
    cache: "no-store", // ডাটা ফ্রেশ পাওয়ার জন্য
  })
  
  if (!res.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return res.json()
}

export const createJob = async (data: JobFormData) => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error("You must be signed in to create a job")
  }

  if (session.user.role !== "recruiter") {
    throw new Error("Only recruiters can create jobs")
  }

  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      recruiterId: session.user.id,
      ...(data.companyId ? { companyId: data.companyId } : {}),
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create job (${res.status})`)
  }
}