import { render, screen, fireEvent, act } from "@testing-library/react";
import WaitingPage from "./WaitingPage";
import { useProposalStatus } from "@/hooks/useProposal";

jest.mock("@/assets", () => ({
  waiting: "waiting.png",
  sucess: "success.png",
  failed: "failed.png",
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as {}),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams("spaj_number=123")],
}));

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

// 🧪 Mock proposal hook
jest.mock("@/hooks/useProposal", () => ({
  useProposalStatus: jest.fn(),
}));

describe("WaitingPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders initial waiting state", () => {
    (useProposalStatus as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<WaitingPage />);

    expect(screen.getByText("Waiting Title")).toBeInTheDocument();
    expect(screen.getByText("Waiting Description")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("2:00");
  });

  it("navigates to /payment when success", () => {
    (useProposalStatus as jest.Mock).mockReturnValue({
      data: { success: true },
      isLoading: false,
      isError: false,
    });

    render(<WaitingPage />);

    // Jalankan timer biar useEffect update
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/payment");
  });

  it("navigates to / if not success", () => {
    (useProposalStatus as jest.Mock).mockReturnValue({
      data: { success: false },
      isLoading: false,
      isError: false,
    });

    render(<WaitingPage />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("resets timer if expired and not success", () => {
  (useProposalStatus as jest.Mock).mockReturnValue({
    data: { success: false },
    isLoading: false,
    isError: false,
  });

  render(<WaitingPage />);
  act(() => {
    jest.advanceTimersByTime(120_000);
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByRole("button")).toHaveTextContent("2:00");
});
});
