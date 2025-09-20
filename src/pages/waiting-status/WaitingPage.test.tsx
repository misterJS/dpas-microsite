import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import WaitingPage from "./WaitingPage"

// mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        "progressStatus.waiting.title": "Waiting Title",
        "progressStatus.waiting.desc": "Waiting Description",
        "progressStatus.sucess.title": "Success Title",
        "progressStatus.sucess.desc": "Success Description",
        "progressStatus.sucess.paymentButton": "Pay Now",
        "progressStatus.header.preparation": "Preparation",
        "progressStatus.header.payment": "Payment",
      }
      return dict[key] || key
    },
  }),
}))

// mock navigate
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}))

// mock assets
jest.mock("@/assets", () => ({
  waiting: "waiting.png",
  sucess: "success.png",
  failed: "failed.png",
}))

describe("WaitingPage", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders initial waiting state correctly", () => {
    render(<WaitingPage />)

    expect(screen.getByText("Preparation")).toBeInTheDocument()
    expect(screen.getByText("Payment")).toBeInTheDocument()
    expect(screen.getByText("Waiting Title")).toBeInTheDocument()
    expect(screen.getByText("Waiting Description")).toBeInTheDocument()
    expect(screen.getByRole("button")).toHaveTextContent("2:00")
    expect(screen.getByRole("img")).toHaveAttribute("src", "waiting.png")
  })

  it("transitions to success state after countdown ends", () => {
    render(<WaitingPage />)

    // fast forward countdown 120s
    act(() => {
      jest.advanceTimersByTime(121_000)
    })

    expect(screen.getByText("Success Title")).toBeInTheDocument()
    expect(screen.getByText("Success Description")).toBeInTheDocument()
    expect(screen.getByRole("button")).toHaveTextContent("Pay Now")
    expect(screen.getByRole("img")).toHaveAttribute("src", "success.png")
  })

  it("navigates to / when clicked before success", () => {
    render(<WaitingPage />)

    fireEvent.click(screen.getByRole("button"))
    expect(mockNavigate).toHaveBeenCalledWith("/")
  })

  it("navigates to /payment when clicked after success", () => {
    render(<WaitingPage />)

    act(() => {
      jest.advanceTimersByTime(121_000)
    })

    fireEvent.click(screen.getByRole("button"))
    expect(mockNavigate).toHaveBeenCalledWith("/payment")
  })
})
