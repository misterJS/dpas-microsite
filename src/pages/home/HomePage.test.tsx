import { render, screen, fireEvent } from "@testing-library/react"
import HomePage from "./HomePage"

// mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "landing.title": "Life Insurance Now",
        "landing.lifeInsurance": "Life Insurance",
        "landing.subTittle": "Protect your family with us",
        "landing.registerNow": "Register Now",
        "landing.desc": "Description of life insurance",
        "landing.checkRiplay": "Check Riplay",
      }
      return translations[key] || key
    },
  }),
}))

// mock react-router-dom
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [
    new URLSearchParams({
      type: "check-riplay",
      slug: "uob",
      product: "ACC",
    }),
  ],
  useParams: () => ({
    brand: "uob",
  }),
}))

// mock assets
jest.mock("@/assets", () => ({
  bannerLanding: "banner.png",
  itemLanding: "item.png",
}))

jest.mock("uuid", () => ({
  v4: () => "mocked-uuid",
}))


describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders banner and item images", () => {
    render(<HomePage />)

    expect(screen.getByAltText("image.banner")).toBeInTheDocument()
    expect(screen.getByAltText("image.item")).toBeInTheDocument()
  })

  it("navigates to /products when Register Now button clicked", () => {
    render(<HomePage />)

    const button = screen.getByRole("button", { name: "Register Now" })
    fireEvent.click(button)
    const brand = 'uob'
    expect(mockNavigate).toHaveBeenCalledWith(`/${brand}/products`)
  })

  it("navigates to /pdf?type=check-riplay when Check Riplay clicked", () => {
    render(<HomePage />)

    const button = screen.getByRole("button", { name: /Check Riplay/i })
    fireEvent.click(button)
    const brand = 'uob'
    expect(mockNavigate).toHaveBeenCalledWith(`/${brand}/pdf?type=check-riplay`)
  })
})
