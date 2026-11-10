"use server"

import type { JobFormData } from "@/lib/types/jobs"

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
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create job")
  }

  return res.json()
}