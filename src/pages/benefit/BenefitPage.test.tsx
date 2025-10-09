import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"
import BenefitPage from "@/pages/benefit/BenefitPage"

jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({ t: (k: string) => k }),
}))

const mockedUseProducts = jest.fn()
jest.mock("@/hooks/useProducts", () => ({
  useProducts: (...args: unknown[]) => mockedUseProducts(...(args as [])),
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <BenefitPage />
    </MemoryRouter>
  )

describe("BenefitPage", () => {
  beforeEach(() => mockedUseProducts.mockReset())

  it("shows loading state", () => {
    mockedUseProducts.mockReturnValue({ data: undefined, isLoading: true, isError: false })
    renderPage()
    expect(screen.getByText("status.loading")).toBeInTheDocument()
  })

  it("shows error state", () => {
    mockedUseProducts.mockReturnValue({ data: undefined, isLoading: false, isError: true })
    renderPage()
    expect(screen.getByText("status.loadProductsFailed")).toBeInTheDocument()
  })

  it("renders products as cards with links", () => {
    mockedUseProducts.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        { product_code: "ACC", product_name: "Accident", desc: "Desc A", image: "/img/a.png", product_id: 1, microsite_id: "uob" },
        { product_code: "CTAK", product_name: "CTAK", desc: "Desc B", image: "/img/b.png", product_id: 2, microsite_id: "uob" },
      ],
    })
    renderPage()

    expect(screen.getByText("content.products")).toBeInTheDocument()
    expect(screen.getByText("Accident")).toBeInTheDocument()
    expect(screen.getByText("CTAK")).toBeInTheDocument()
    expect(screen.getByLabelText("Accident - actions.readMore")).toHaveAttribute("href", "/products/ACC")
    expect(screen.getByLabelText("CTAK - actions.readMore")).toHaveAttribute("href", "/products/CTAK")
  })
})

