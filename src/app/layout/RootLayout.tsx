import Footer from "@/components/common/Footer"
import HeroHeader from "@/components/common/HeroHeader"
import { Outlet, useLocation, useParams } from "react-router-dom"

export default function RootLayout() {
  const { pathname } = useLocation();
  const { brand } = useParams()
  const isLandingPage = pathname.replace(`${brand}`,'') === '/'
  const isWaiting = pathname.includes('waiting-status')

  const getShowHeader = () => {
    if (pathname.includes('pdf')) return false;
    if (pathname.includes('consent')) return false;
    if (pathname.includes('waiting-status')) return false;
    return true;
  }
  const getShowFooter = () => {
    if (pathname.includes('pdf')) return false;
    return true;
  }

  const showHeader: boolean = getShowHeader()
  const showFooter: boolean = getShowFooter()
  
  return (
    <div>
      <main className="flex flex-col min-h-screen">
        <HeroHeader showHeader={showHeader} />
        <div className={isLandingPage || isWaiting ? "p-0 flex-grow" : "p-4"}><Outlet /></div>
        <Footer showFooter={showFooter} />
      </main>
    </div>
  )
}
