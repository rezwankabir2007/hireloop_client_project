import { SlidersHorizontal } from "lucide-react"

const jobTypes = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
]

export type JobFiltersState = {
  category: string
  type: string
  workArrangement: string
  salaryMin: string
  salaryMax: string
}

type JobFiltersProps = {
  categories: string[]
  filters: JobFiltersState
  onFiltersChange: (filters: JobFiltersState) => void
  onClear: () => void
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-b pb-5 last:border-0 last:pb-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

function FilterOption({
  id,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  id: string
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string, checked: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(event) => onChange(value, event.target.checked)}
        className="size-4 rounded border-input accent-primary"
      />
      {label}
    </label>
  )
}

export function JobFilters({
  categories,
  filters,
  onFiltersChange,
  onClear,
}: JobFiltersProps) {
  function selectFilter(
    field: "category" | "type" | "workArrangement",
    value: string,
    checked: boolean
  ) {
    onFiltersChange({ ...filters, [field]: checked ? value : "" })
  }

  return (
    <aside
      aria-labelledby="job-filters-heading"
      className="rounded-2xl border bg-card p-5 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 id="job-filters-heading" className="text-lg font-semibold">
          Filters
        </h2>
        <SlidersHorizontal
          aria-hidden="true"
          className="size-5 text-violet-500"
        />
      </div>

      <div className="space-y-5">
        <FilterSection title="Category">
          {categories.map((category, index) => (
            <FilterOption
              key={category}
              id={`category-${index}`}
              name="category"
              value={category}
              label={category}
              checked={filters.category === category}
              onChange={(value, checked) =>
                selectFilter("category", value, checked)
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Job type">
          {jobTypes.map(({ label, value }) => (
            <FilterOption
              key={value}
              id={`type-${value}`}
              name="type"
              value={value}
              label={label}
              checked={filters.type === value}
              onChange={(selectedType, checked) =>
                selectFilter("type", selectedType, checked)
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Work arrangement">
          <FilterOption
            id="workplace-remote"
            name="workplace"
            value="remote"
            label="Remote"
            checked={filters.workArrangement === "remote"}
            onChange={(value, checked) =>
              selectFilter("workArrangement", value, checked)
            }
          />
          <FilterOption
            id="workplace-onsite"
            name="workplace"
            value="onsite"
            label="On-site"
            checked={filters.workArrangement === "onsite"}
            onChange={(value, checked) =>
              selectFilter("workArrangement", value, checked)
            }
          />
        </FilterSection>

        <FilterSection title="Salary range">
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="salary-min">
              Minimum salary
            </label>
            <input
              id="salary-min"
              name="salaryMin"
              type="number"
              min="0"
              placeholder="Min"
              value={filters.salaryMin}
              onChange={(event) =>
                onFiltersChange({ ...filters, salaryMin: event.target.value })
              }
              className="h-9 min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <label className="sr-only" htmlFor="salary-max">
              Maximum salary
            </label>
            <input
              id="salary-max"
              name="salaryMax"
              type="number"
              min="0"
              placeholder="Max"
              value={filters.salaryMax}
              onChange={(event) =>
                onFiltersChange({ ...filters, salaryMax: event.target.value })
              }
              className="h-9 min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </FilterSection>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 w-full rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Clear filters
      </button>
    </aside>
  )
}
