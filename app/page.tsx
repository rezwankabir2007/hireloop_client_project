import HeroSection from "@/components/homePage/HeroSection"
import Navber from "@/components/homePage/Navber"

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-8 pt-5 sm:px-6 sm:pt-7">
      <Navber/>

    <HeroSection/>

        {/* <section className="relative pt-8 text-center sm:pt-12 md:pt-12">
          <div className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-1.5 text-[10px] text-white/55 shadow-[0_0_24px_rgba(255,255,255,0.025)] sm:text-[11px]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#211b14] text-[#ff9d42]">
              <BriefcaseBusiness aria-hidden="true" className="size-3" />
            </span>
            <strong className="font-semibold tracking-wide text-white/90">50,000+</strong>
            <span className="font-mono tracking-[0.12em]">NEW JOBS THIS MONTH</span>
          </div>

          <h1 className="relative z-10 mx-auto mt-5 max-w-3xl text-[2rem] leading-[1.12] font-semibold tracking-[-0.045em] sm:text-5xl">
            Find Your Dream Job Today
          </h1>
          <p className="relative z-10 mx-auto mt-3 max-w-lg text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          <form
            action="/jobs"
            method="get"
            id="jobs"
            className="relative z-10 mx-auto mt-6 flex max-w-[680px] flex-col gap-2 rounded-2xl border border-white/[0.09] bg-[#111113]/90 p-2 text-left shadow-[0_12px_55px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-xl sm:py-1.5 sm:pl-3"
          >
            <label className="flex min-h-10 flex-1 items-center gap-2.5 px-2 text-white/55">
              <Search aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only">Job title, skill, or company</span>
              <input
                type="search"
                name="q"
                placeholder="Job title, skill, or company"
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/40"
              />
            </label>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <label className="flex min-h-10 flex-1 items-center gap-2.5 border-t border-white/[0.08] px-2 text-white/55 sm:border-0">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only">Location</span>
              <input
                type="search"
                name="location"
                placeholder="Location or Remote"
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/40"
              />
            </label>
            <Button
              type="submit"
              size="icon"
              aria-label="Search jobs"
              className="h-10 w-full shrink-0 rounded-xl bg-[#6657f5] text-white shadow-[0_0_18px_rgba(102,87,245,0.35)] hover:bg-[#786bff] sm:size-10 sm:w-10 sm:rounded-lg"
            >
              <Search aria-hidden="true" className="size-4" />
              <span className="sm:sr-only">Search jobs</span>
            </Button>
          </form>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-white/45">
            <span className="mr-1">Trending:</span>
            {trendingRoles.map((role) => (
              <Link
                key={role}
                href={`/jobs?q=${encodeURIComponent(role)}`}
                className="rounded-full border border-white/[0.08] bg-white/[0.045] px-2.5 py-1 text-[10px] text-white/70 transition-colors hover:border-[#6657f5]/50 hover:bg-[#6657f5]/10 hover:text-white"
              >
                {role}
              </Link>
            ))}
          </div>
        </section>

        <section
          id="companies"
          aria-label="HireLoop community statistics"
          className="relative z-0 mx-auto mt-6 h-[330px] max-w-[1080px] sm:mt-8 sm:h-[380px] lg:h-[410px]"
        >
          <Image
            src={heroArtwork}
            alt=""
            aria-hidden="true"
            priority
            className="pointer-events-none absolute left-1/2 top-[-34rem] h-auto w-[140vw] max-w-[1180px] -translate-x-1/2 select-none object-contain brightness-125 hue-rotate-[-25deg] md:w-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 26%, black 44%, black 84%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 26%, black 44%, black 84%, transparent 100%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-[230px] z-10 mx-auto max-w-md px-4 text-center lg:bottom-[122px]">
            <p className="text-sm leading-5 tracking-[-0.025em] text-white/75 sm:text-base sm:leading-6">
              Assisting over <span className="font-medium text-white">15,000</span>{" "}
              job seekers
              <br className="hidden sm:block" /> find their dream positions.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="min-h-[104px] rounded-xl border border-white/[0.08] bg-[#09090b]/95 p-3 text-left shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:min-h-[120px] sm:p-4"
              >
                <Icon aria-hidden="true" className="size-3.5 text-white/75" />
                <p className="mt-4 text-[1.65rem] leading-none font-semibold tracking-[-0.04em] sm:mt-5 sm:text-[2rem]">
                  {value}
                </p>
                <p className="mt-2 text-[10px] text-white/65 sm:text-[11px]">{label}</p>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </main>
  )
}
