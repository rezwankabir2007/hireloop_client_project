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

export type JobRecord = JobFormData & { _id: string }
