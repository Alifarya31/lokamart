import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

const mockReplace = jest.fn();
const mockLogin = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ login: mockLogin }) }));

const fill = ({ email = "", password = "" }) => {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Log in" }));

const validInput = { email: "user@lokamart.id", password: "secret123" };

beforeEach(() => {
  jest.clearAllMocks();
  render(<LoginPage />);
});

describe("Login page", () => {
  it("AC: requires the email field", () => {
    fill({ ...validInput, email: "" });
    submit();
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Email is required");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("AC: requires a valid email format", () => {
    fill({ ...validInput, email: "user@invalid" });
    submit();
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Enter a valid email address");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("AC: requires the password field", () => {
    fill({ ...validInput, password: "" });
    submit();
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("Password is required");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it.each(["auth/invalid-credential", "auth/user-not-found"])(
    "AC: rejects an account that is not registered (%s)",
    async (code) => {
      mockLogin.mockRejectedValue({ code });
      fill(validInput);
      submit();

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent("Incorrect email or password");
      expect(alert).toHaveTextContent("register for a new account");
      expect(mockReplace).not.toHaveBeenCalled();
    }
  );

  it("AC: redirects a customer to the customer dashboard after login", async () => {
    mockLogin.mockResolvedValue("customer");
    fill(validInput);
    submit();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(mockLogin).toHaveBeenCalledWith({ ...validInput, remember: true });
  });

  it("AC: redirects a seller to the seller dashboard after login", async () => {
    mockLogin.mockResolvedValue("seller");
    fill(validInput);
    submit();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/seller"));
  });

  it("AC: links to the registration page", () => {
    expect(screen.getByRole("link", { name: /Register/ })).toHaveAttribute("href", "/register");
  });

  it("lets the user dismiss the error banner", async () => {
    mockLogin.mockRejectedValue({ code: "auth/invalid-credential" });
    fill(validInput);
    submit();
    await screen.findByRole("alert");

    fireEvent.click(screen.getByRole("button", { name: "Dismiss error" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a generic message for unexpected errors and re-enables the button", async () => {
    mockLogin.mockRejectedValue(new Error("boom"));
    fill(validInput);
    submit();

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  });

  it("disables the button while logging in", async () => {
    mockLogin.mockReturnValue(new Promise(() => {}));
    fill(validInput);
    submit();

    expect(await screen.findByRole("button", { name: "Logging in..." })).toBeDisabled();
  });

  it("has a show/hide toggle on the password field", () => {
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });
});

describe("Login page approved extras", () => {
  it("has Keep me signed in checked by default and passes it to login", async () => {
    mockLogin.mockResolvedValue("customer");
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).toBeChecked();

    fill(validInput);
    submit();
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ ...validInput, remember: true }));
  });

  it("passes remember: false when Keep me signed in is unchecked", async () => {
    mockLogin.mockResolvedValue("customer");
    fireEvent.click(screen.getByRole("checkbox", { name: "Keep me signed in" }));
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).not.toBeChecked();

    fill(validInput);
    submit();
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({ ...validInput, remember: false }));
  });

  it("links to the forgot password page from the password label row", () => {
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
  });
});
