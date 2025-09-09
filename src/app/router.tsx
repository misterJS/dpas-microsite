import { lazy } from "react"
import { createBrowserRouter, type RouteObject } from "react-router-dom"
import RootLayout from "./layout/RootLayout"
import DetailPdf from "@/pages/pdf/DetailPdf"

const HomePage = lazy(() => import("@/pages/home/HomePage"))
const BenefitPage = lazy(() => import("@/pages/benefit/BenefitPage"))
const BenefitDetailPage = lazy(() => import("@/pages/benefit/detail/BenefitDetailPage"))
const RegisterPage = lazy(() => import("@/pages/register/RegisterPage"))
const HealthQuestionsPage = lazy(() => import("@/pages/health-question/HealthQuestionPage"))
const RiplayPage = lazy(() => import("@/pages/riplay/RiplayPage"))
const ConsentPage = lazy(() => import("@/pages/consent/ConsentPage"))
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"))

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <BenefitPage /> },
      { path: "/products/:id", element: <BenefitDetailPage /> },
      { path: "/pdf/:type", element: <DetailPdf /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/health-question", element: <HealthQuestionsPage /> },
      { path: "/riplay", element: <RiplayPage /> },
      { path: "/consent", element: <ConsentPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
