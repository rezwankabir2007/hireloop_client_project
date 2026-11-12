export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "accepted"
  | "withdrawn"

export type ApplicationPayload = {
  jobId: string
  userId: string
  applicantName: string
  email: string
  jobTitle: string
  companyName: string
  jobCategory: string
  jobType: string
  location: string
  remote: boolean
  salaryMin: string
  salaryMax: string
  currency: string
  deadline: string
  appliedAt: string
  status: ApplicationStatus
}

export type ApplicationRecord = Pick<
  ApplicationPayload,
  "jobId" | "userId" | "jobTitle" | "appliedAt"
> &
  Partial<
    Omit<
      ApplicationPayload,
      "jobId" | "userId" | "jobTitle" | "appliedAt" | "status"
    >
  > & {
    _id?: string
    status?: string
  }
