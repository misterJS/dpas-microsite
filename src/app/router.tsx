import { lazy } from "react"
import { createBrowserRouter, type RouteObject } from "react-router-dom"
import RootLayout from "./layout/RootLayout"

const HomePage = lazy(() => import("@/pages/home/HomePage"))
const BenefitPage = lazy(() => import("@/pages/benefit/BenefitPage"))
const BenefitDetailPage = lazy(() => import("@/pages/benefit/detail/BenefitDetailPage"))
const RegisterPage = lazy(() => import("@/pages/register/RegisterPage"))
const HealthQuestionsPage = lazy(() => import("@/pages/health-question/HealthQuestionPage"))
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"))

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/benefit", element: <BenefitPage /> },
      { path: "/benefit/:id", element: <BenefitDetailPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/health-question", element: <HealthQuestionsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
