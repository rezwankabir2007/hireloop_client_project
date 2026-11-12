import type {
  ApplicationPayload,
  ApplicationRecord,
} from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const FREE_APPLICATION_LIMIT = 10

function isApplicationRecord(value: unknown): value is ApplicationRecord {
  if (!value || typeof value !== "object") return false

  const record = value as Record<string, unknown>
  return (
    typeof record.jobId === "string" &&
    typeof record.userId === "string" &&
    typeof record.jobTitle === "string" &&
    typeof record.appliedAt === "string"
  )
}

function readErrorMessage(body: string, statusText: string) {
  if (body.trim()) {
    try {
      const payload: unknown = JSON.parse(body)
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
      ) {
        return payload.message
      }
    } catch {
      return body
    }
  }

  return statusText || "The application request failed."
}

export async function getApplicationUsage(userId: string): Promise<{
  count: number
  isPremium: boolean
}> {
  const query = new URLSearchParams({ userId })
  const response = await fetch(`${BASE_URL}/applications/count?${query}`)

  if (!response.ok) {
    throw new Error(`Failed to check application limit: ${response.statusText}`)
  }

  const payload: unknown = await response.json()
  const count =
    typeof payload === "number"
      ? payload
      : payload &&
          typeof payload === "object" &&
          "count" in payload &&
          typeof payload.count === "number"
        ? payload.count
        : null
  const isPremium = Boolean(
    payload &&
    typeof payload === "object" &&
    "isPremium" in payload &&
    payload.isPremium === true
  )

  if (count === null || !Number.isInteger(count) || count < 0) {
    throw new Error("The application count response has an invalid format.")
  }

  return { count, isPremium }
}

export async function createApplication(application: ApplicationPayload) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(application),
  })

  if (!response.ok) {
    throw new Error(readErrorMessage(await response.text(), response.statusText))
  }
}

export async function getApplications(userId: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ userId })
  const response = await fetch(`${BASE_URL}/applications?${query}`, { signal })

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`)
  }

  const payload: unknown = await response.json()
  const records = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        "applications" in payload &&
        Array.isArray(payload.applications)
      ? payload.applications
      : null

  if (!records || !records.every(isApplicationRecord)) {
    throw new Error("The applications response has an invalid format.")
  }

  return records
}
