import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ContentPdf from "./DetailPdf"

// mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        "status.loading": "Loading...",
        "status.loadFailed": "Load Failed",
        "form.next": "Next",
        "health.back": "Back",
      }
      return dict[key] || key
    },
  }),
}))

// mock react-router-dom
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [
    new URLSearchParams({
      type: "check-riplay",
      slug: "uob",
      product: "ACC",
    }),
  ],
}))

// mock store
jest.mock("@/lib/store/submissionDataStore", () => ({
  useSubmissionStore: () => ({
    submission: {
      client: {
        fullName: "John Doe",
        dob: "1990-01-01",
        sex: "Male",
        email: "john@example.com",
      },
      product: {
        package: {
          packageName: "Silver Plan",
          term: { term: 12 },
        },
      },
    },
  }),
}))

// mock useDocument
const mockUseDocument = jest.fn()
jest.mock("@/hooks/useDocument", () => ({
  useDocument: (...args: any[]) => mockUseDocument(...args),
}))

// mock PdfViewer
jest.mock("./PdfViewer", () => (props: { pdfUrl: string }) => (
  <div data-testid="pdf-viewer">{props.pdfUrl}</div>
))

// mock assets
jest.mock("@/assets", () => ({
  pdfFileCheckRiplay: "check-riplay.pdf",
}))

describe("ContentPdf", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows loading state", () => {
    mockUseDocument.mockReturnValue({ data: null, isLoading: true, isError: false })
    render(<ContentPdf />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows error state", () => {
    mockUseDocument.mockReturnValue({ data: null, isLoading: false, isError: true })
    render(<ContentPdf />)
    expect(screen.getByText("Load Failed")).toBeInTheDocument()
  })

  it("renders PdfViewer with check-riplay pdf", () => {
    mockUseDocument.mockReturnValue({ data: null, isLoading: false, isError: false })
    render(<ContentPdf />)

    expect(screen.getByTestId("pdf-viewer")).toHaveTextContent("check-riplay.pdf")
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument()
  })

})
