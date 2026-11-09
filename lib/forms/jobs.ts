import type { JobFormData } from "@/lib/types/jobs"

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export function getJobFormData(formData: FormData): JobFormData {
  return {
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
}
