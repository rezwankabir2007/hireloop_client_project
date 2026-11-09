export const jobFormStyles = {
  page: "mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6",
  form: "space-y-6",
  section: "space-y-5 rounded-xl border bg-card p-5 sm:p-6",
  sectionTitle: "font-semibold",
  sectionDescription: "mt-1 text-sm text-muted-foreground",
  field: "flex flex-col gap-2 text-sm font-medium text-foreground",
  remoteField: "flex items-center gap-2 self-end pb-2 text-sm",
  select:
    "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  textarea:
    "min-h-28 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-normal outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  backLink:
    "text-sm text-muted-foreground transition-colors hover:text-foreground",
  pageTitle: "text-2xl font-semibold tracking-tight",
  pageDescription: "mt-1 text-sm text-muted-foreground",
  actions: "flex justify-end",
} as const
