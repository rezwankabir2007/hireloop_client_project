import type { JobRecord } from "@/lib/types/jobs"
import { MapPin } from "lucide-react"

type JobCardProps = {
  job: JobRecord
  onClick?: () => void
}

function getSalaryRange(job: JobRecord) {
  const salary = [job.salaryMin, job.salaryMax].filter(Boolean).join(" - ")

  return salary ? `${job.currency} ${salary}`.trim() : null
}

export function JobCard({ job, onClick }: JobCardProps) {
  const salaryRange = getSalaryRange(job)

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="flex min-h-52 cursor-pointer flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-violet-500 hover:shadow-md sm:p-6"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug">{job.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{job.category}</p>
          </div>
          <span className="shrink-0 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500">
            {job.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {job.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {job.location}
            </span>
          )}
          <span>{job.remote ? "Remote" : "On-site"}</span>
          {salaryRange && <span>{salaryRange}</span>}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">
          {job.deadline ? `Apply by ${job.deadline}` : "Applications open"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation() // যাতে ডাবল ক্লিক ট্রিগার না হয়
            onClick?.()
          }}
          className="text-sm font-semibold text-violet-500 transition-colors hover:text-violet-400 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View details
        </button>
      </div>
    </article>
  )
}