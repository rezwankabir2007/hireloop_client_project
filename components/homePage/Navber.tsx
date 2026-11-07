import Image from "next/image";
import logo from "../.././app/images/logo.png";

import Link from "next/link";
import { Menu, X } from "lucide-react";


const navigationLinks = [
  { label: "Browse Jobs", href: "#jobs" },
  { label: "Companies", href: "#companies" },
  { label: "Pricing", href: "/pricing" },
]




const Navber = () => {
    return (
      <header className="relative z-20 flex h-14 items-center justify-between rounded-xl border border-white/[0.06] bg-[#171719]/90 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6">
          <Link href="/" aria-label="HireLoop home" className="shrink-0">
            <Image
              src={logo}
              alt="HireLoop"
              priority
              className="h-auto w-[94px] sm:w-[104px]"
            />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/sign-in"
              className="text-xs font-medium text-[#8176ff] transition-colors hover:text-[#aaa3ff]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#6657f5] px-4 text-xs font-medium text-white shadow-[0_0_20px_rgba(102,87,245,0.24)] transition-colors hover:bg-[#786bff]"
            >
              Get Started
            </Link>
          </div>

          <details className="group relative md:hidden">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden="true" className="size-5 group-open:hidden" />
              <X aria-hidden="true" className="hidden size-5 group-open:block" />
              <span className="sr-only">Toggle navigation</span>
            </summary>
            <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-white/10 bg-[#151517] p-3 shadow-2xl">
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-white/10" />
                <Link
                  href="/sign-in"
                  className="rounded-lg px-3 py-2.5 text-sm text-[#a69fff] transition-colors hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#6657f5] text-sm font-medium text-white transition-colors hover:bg-[#786bff]"
                >
                  Get Started
                </Link>
              </nav>
            </div>
          </details>
        </header>
    );
};

export default Navber;