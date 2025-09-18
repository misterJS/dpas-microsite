import { Footer } from "@/components/common/Footer"
import HeroHeader from "@/components/common/HeroHeader"
import { Outlet, useLocation } from "react-router-dom"

export default function RootLayout() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/'
  const isWaiting = pathname.includes('waiting-status')
  
  return (
    <div>
      <main className="flex flex-col min-h-screen">
        <HeroHeader />
        <div className={isLandingPage || isWaiting ? "p-0 flex-grow" : "p-4"}><Outlet /></div>
        <Footer />
      </main>
    </div>
  )
}
