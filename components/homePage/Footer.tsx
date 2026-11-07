import Image from "next/image"
import Link from "next/link"

import logo from "../../app/images/logo.png"
import footerArtwork from "../../app/images/cta-bg.png"

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "#jobs" },
      { label: "Worker AI", href: "#jobs" },
      { label: "Companies", href: "#companies" },
      { label: "Salary data", href: "#companies" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "#footer" },
      { label: "Career library", href: "#jobs" },
      { label: "Contact", href: "#footer" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "#footer" },
      { label: "Newsroom", href: "#footer" },
    ],
  },
]

const socialLinks = [
  { label: "Facebook", mark: "f" },
  { label: "Pinterest", mark: "p" },
  { label: "LinkedIn", mark: "in" },
]

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative isolate mx-auto mt-8 w-full max-w-[1180px] overflow-hidden border-t border-[#168bff]/70 bg-[#050505] text-white shadow-[0_-8px_50px_rgba(27,100,255,0.07)]"
    >
      <section
        aria-labelledby="footer-cta-title"
        className="relative flex min-h-[300px] flex-col items-center justify-start overflow-hidden px-4 pb-14 pt-14 text-center sm:min-h-[330px] sm:pt-16"
      >
        <Image
          src={footerArtwork}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-auto w-full opacity-90 brightness-125 hue-rotate-[25deg] object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(82,73,255,0.55),transparent_58%),linear-gradient(to_bottom,rgba(5,5,12,0.06),#050505_88%)]"
        />

        <h2
          id="footer-cta-title"
          className="relative z-10 max-w-xl text-3xl leading-tight font-medium tracking-[-0.045em] sm:text-4xl"
        >
          Your next role is
          <br />
          already looking for you
        </h2>
        <p className="relative z-10 mt-3 max-w-lg text-xs leading-5 text-white/55 sm:text-sm">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-xs font-medium text-[#111116] transition-colors hover:bg-white/85"
          >
            Create a free account
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-[#111116]/80 px-4 text-xs font-medium text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            View pricing
          </Link>
        </div>
      </section>

      <div className="grid gap-10 px-6 pb-8 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8 lg:px-12">
        <div className="max-w-[260px]">
          <Link href="/" aria-label="HireLoop home" className="inline-flex">
            <Image
              src={logo}
              alt="HireLoop"
              className="h-auto w-[104px] opacity-80"
            />
          </Link>
          <p className="mt-4 text-[11px] leading-5 text-white/40">
            The AI-native career platform. Built for people who take their work
            seriously.
          </p>
          <nav aria-label="Social media" className="mt-6 flex gap-2">
            {socialLinks.map(({ label, mark }) => (
              <a
                key={label}
                href="#footer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.035] text-xs font-semibold text-white/55 transition-colors hover:border-[#6657f5]/50 hover:bg-[#6657f5]/15 hover:text-white"
              >
                {mark}
              </a>
            ))}
          </nav>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-[11px] font-medium text-[#8b7fff]">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-white/40 transition-colors hover:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-6 flex flex-col gap-3 border-t border-white/[0.06] py-5 text-[10px] text-white/35 sm:mx-8 sm:flex-row sm:items-center sm:justify-between lg:mx-12">
        <p>Copyright 2024 — Programming Hero</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="#footer" className="transition-colors hover:text-white/70">
            Terms &amp; Policy
          </Link>
          <Link href="#footer" className="transition-colors hover:text-white/70">
            Privacy Guideline
          </Link>
        </nav>
      </div>
    </footer>
  )
}
