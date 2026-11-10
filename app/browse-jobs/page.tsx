import { BrowseJobsContent } from "@/components/jobs/browse-jobs-content"
import { getJobs } from "@/lib/api/jobs"
import type { JobRecord } from "@/lib/types/jobs"

export default async function BrowseJobsPage() {
  const jobs: JobRecord[] = await getJobs()
  const categories = [
    ...new Set(jobs.map((job) => job.category.trim()).filter(Boolean)),
  ].sort((first, second) => first.localeCompare(second))

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-violet-500">
            CAREER OPPORTUNITIES
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next opportunity
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Explore roles from teams looking for their next great hire.
          </p>
        </header>

        <BrowseJobsContent jobs={jobs} categories={categories} />
      </div>
    </main>
  )
}
