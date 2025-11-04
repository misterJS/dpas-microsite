import { lazy } from "react"
import { createBrowserRouter, type RouteObject } from "react-router-dom"
import RootLayout from "./layout/RootLayout"

const HomePage = lazy(() => import("@/pages/home/HomePage"))
const BenefitPage = lazy(() => import("@/pages/benefit/BenefitPage"))
const BenefitDetailPage = lazy(() => import("@/pages/benefit/detail/BenefitDetailPage"))
const RegisterPage = lazy(() => import("@/pages/register/RegisterPage"))
const DetailPdf = lazy(() => import("@/pages/pdf/DetailPdf"))
const HealthQuestionsPage = lazy(() => import("@/pages/health-question/HealthQuestionPage"))
const ConsentPage = lazy(() => import("@/pages/consent/ConsentPage"))
const WaitingPage = lazy(() => import("@/pages/waiting-status/WaitingPage"))
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"))

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/:brand", element: <HomePage /> },
      { path: "/:brand/products", element: <BenefitPage /> },
      { path: "/:brand/products/:id", element: <BenefitDetailPage /> },
      { path: "/:brand/pdf", element: <DetailPdf /> },
      { path: "/:brand/registration-form", element: <RegisterPage /> },
      { path: "/:brand/health-question", element: <HealthQuestionsPage /> },
      { path: "/:brand/consent", element: <ConsentPage /> },
      { path: "/:brand/waiting-status", element: <WaitingPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
