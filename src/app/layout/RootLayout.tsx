import { Footer } from "@/components/common/Footer"
import HeroHeader from "@/components/common/HeroHeader"
import { Outlet, useLocation } from "react-router-dom"

export default function RootLayout() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/'
  return (
    <div>
      <main>
        <HeroHeader />
        <div className={isLandingPage ? "p-0" : "p-4"}><Outlet /></div>
        <Footer />
      </main>
    </div>
  )
}
