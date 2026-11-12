"use client"

import { JobCard } from "@/components/jobs/job-card"
import {
  JobFilters,
  type JobFiltersState,
} from "@/components/jobs/job-filters"
import type { JobRecord } from "@/lib/types/jobs"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"

type BrowseJobsContentProps = {
  initialJobs?: JobRecord[]
  categories?: string[]
}

const initialFilters: JobFiltersState = {
  category: "",
  type: "",
  workArrangement: "",
  salaryMin: "",
  salaryMax: "",
}

function toSalaryNumber(value: string) {
  const normalizedValue = value.replaceAll(",", "").trim()
  if (!normalizedValue) return null

  const salary = Number(normalizedValue)
  return Number.isFinite(salary) ? salary : null
}

export function BrowseJobsContent({
  initialJobs = [],
  categories = [],
}: BrowseJobsContentProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobRecord[]>(initialJobs)
  const [loading, setLoading] = useState<boolean>(initialJobs.length === 0)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState(initialFilters)

  // API Call - Fetch Jobs from Local Server
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("http://localhost:5000/jobs")
        
        if (!response.ok) {
          throw new Error("Failed to fetch jobs data")
        }

        const data = await response.json()
        // API response Structure handler
        const fetchedJobs = Array.isArray(data) ? data : data.jobs || []
        setJobs(fetchedJobs)
      } catch (err) {
        console.error("Error loading jobs:", err)
        setError("Could not load jobs from server.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    const minimumSalary = filters.salaryMin
      ? toSalaryNumber(filters.salaryMin)
      : null
    const maximumSalary = filters.salaryMax
      ? toSalaryNumber(filters.salaryMax)
      : null

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [job.title, job.category, job.location]
          .some((value) => value?.toLocaleLowerCase().includes(query))

      const matchesCategory =
        !filters.category || filters.category === job.category
      const matchesType = !filters.type || filters.type === job.type
      const matchesWorkArrangement =
        !filters.workArrangement ||
        filters.workArrangement === (job.remote ? "remote" : "onsite")

      const jobMinimum = toSalaryNumber(job.salaryMin)
      const jobMaximum = toSalaryNumber(job.salaryMax)
      const hasSalaryFilter = minimumSalary !== null || maximumSalary !== null
      const matchesMinimumSalary =
        minimumSalary === null ||
        (jobMaximum !== null && jobMaximum >= minimumSalary)
      const matchesMaximumSalary =
        maximumSalary === null ||
        (jobMinimum !== null && jobMinimum <= maximumSalary)
      const matchesSalary =
        !hasSalaryFilter || (matchesMinimumSalary && matchesMaximumSalary)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesWorkArrangement &&
        matchesSalary
      )
    })
  }, [filters, jobs, searchQuery])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchQuery(searchInput)
  }

  function clearFilters() {
    setFilters(initialFilters)
  }

  function clearAll() {
    clearFilters()
    setSearchInput("")
    setSearchQuery("")
  }

  const hasActiveFilters =
    filters.category !== "" ||
    filters.type !== "" ||
    filters.workArrangement !== "" ||
    filters.salaryMin !== "" ||
    filters.salaryMax !== "" ||
    searchQuery !== ""

  const handleViewJobDetails = (jobId: string) => {
    router.push(`/browse-jobs/${jobId}`)
  }

  return (
    <>
      <form
        onSubmit={handleSearch}
        role="search"
        className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <label htmlFor="job-search" className="sr-only">
            Search by job title, category, or location
          </label>
          <input
            id="job-search"
            name="search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Job title, category, or location"
            className="h-11 w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Search jobs
        </button>
      </form>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <JobFilters
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
        />

        <section aria-labelledby="job-results-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2
                id="job-results-heading"
                className="text-xl font-semibold tracking-tight"
              >
                Available jobs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                Showing {filteredJobs.length} of {jobs.length}{" "}
                {jobs.length === 1 ? "opportunity" : "opportunities"}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium text-violet-500 hover:text-violet-400 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear all
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
              <Loader2 className="size-8 animate-spin text-violet-500" />
              <p className="mt-2 text-sm text-muted-foreground">Loading jobs from server...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-red-500/50 bg-card px-6 py-16 text-center text-red-500">
              <p className="font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-semibold text-violet-500 hover:text-violet-400"
              >
                Retry
              </button>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  onClick={() => handleViewJobDetails(job._id)}
                  job={job}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
              <h3 className="font-semibold">No matching jobs found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another search or adjust your filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 text-sm font-semibold text-violet-500 hover:text-violet-400"
              >
                Clear search and filters
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}