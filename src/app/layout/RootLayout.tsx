import { Footer } from "@/components/common/Footer"
import HeroHeader from "@/components/common/HeroHeader"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <div>
      <main>
        <HeroHeader />
        <div className="p-4"><Outlet /></div>
        <Footer />
      </main>
    </div>
  )
}
