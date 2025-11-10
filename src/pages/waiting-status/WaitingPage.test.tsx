import { render, screen, fireEvent, act } from "@testing-library/react";
import WaitingPage from "./WaitingPage";
import { useProposalStatus } from "@/hooks/useProposal";
import { UseQueryResult } from "@tanstack/react-query";

jest.mock("@/assets", () => ({
  waiting: "waiting.png",
  sucess: "success.png",
  failed: "failed.png",
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams({ spaj_number: "12345" })],
  useParams: () => ({
    brand: "uob",
  }),
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
      };
      return dict[key] || key;
    },
  }),
}))

const mockMutate = jest.fn();
jest.mock("@/hooks/useProposal", () => ({
  useProposalStatus: jest.fn(() => ({
    data: { success: false },
    isLoading: false,
    isError: false,
  })),
  usePayment: jest.fn(() => ({
    mutate: mockMutate,
    isSuccess: false,
    isError: false,
  })),
}));

describe("WaitingPage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders initial waiting state", () => {
    render(<WaitingPage />);
    expect(screen.getByText("Waiting Title")).toBeInTheDocument();
    expect(screen.getByText("Waiting Description")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "waiting.png");
    expect(screen.getByRole("button")).toHaveTextContent("2:00");
  });

  test("navigates to home if status not success", () => {
    (useProposalStatus as jest.Mock).mockReturnValue({
      data: { failed: true },
      isLoading: false,
      isError: false,
    });

    render(<WaitingPage />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const brand = 'uob'
    expect(mockNavigate).toHaveBeenCalledWith(`/${brand}?reset_session=true`);
  });

});
