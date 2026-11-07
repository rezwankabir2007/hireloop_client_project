import HeroSection from "@/components/homePage/HeroSection"
import Footer from "@/components/homePage/Footer"
import Navber from "@/components/homePage/Navbar"

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-8 pt-5 sm:px-6 sm:pt-7">
      <Navber/>

    <HeroSection/>

      </div>
      <Footer />
    </main>
  )
}
