import { fireEvent, render, screen } from "@testing-library/react";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

const mockResetPassword = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ resetPassword: mockResetPassword }) }));

const SENT_MESSAGE = "If an account exists for this email, a reset link has been sent.";

const fillAndSubmit = (email) => {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));
};

beforeEach(() => {
  jest.clearAllMocks();
  render(<ForgotPasswordPage />);
});

describe("Forgot password page (approved extra)", () => {
  it("requires an email", () => {
    fillAndSubmit("");
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Email is required");
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("requires a valid email format", () => {
    fillAndSubmit("user@invalid");
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Enter a valid email address");
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("sends the reset email and shows the success message", async () => {
    mockResetPassword.mockResolvedValue();
    fillAndSubmit("user@lokamart.id");

    expect(await screen.findByRole("status")).toHaveTextContent(SENT_MESSAGE);
    expect(mockResetPassword).toHaveBeenCalledWith("user@lokamart.id");
    expect(screen.queryByLabelText("Email address")).not.toBeInTheDocument();
  });

  it("shows the exact same message when the email is not registered", async () => {
    mockResetPassword.mockRejectedValue({ code: "auth/user-not-found" });
    fillAndSubmit("nobody@lokamart.id");

    expect(await screen.findByRole("status")).toHaveTextContent(SENT_MESSAGE);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each([
    ["auth/network-request-failed", "Network error"],
    ["auth/too-many-requests", "Too many attempts"],
    ["auth/api-key-not-valid", "Something went wrong"],
  ])("asks the user to retry on %s without revealing the account", async (code, text) => {
    mockResetPassword.mockRejectedValue({ code });
    fillAndSubmit("user@lokamart.id");

    expect(await screen.findByRole("alert")).toHaveTextContent(text);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send reset link" })).toBeEnabled();
  });

  it("disables the button while sending", async () => {
    mockResetPassword.mockReturnValue(new Promise(() => {}));
    fillAndSubmit("user@lokamart.id");

    expect(await screen.findByRole("button", { name: "Sending..." })).toBeDisabled();
  });

  it("links back to the login page", () => {
    expect(screen.getByRole("link", { name: "Back to log in" })).toHaveAttribute("href", "/login");
  });
});
