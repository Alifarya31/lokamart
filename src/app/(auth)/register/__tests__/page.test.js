import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";

const mockReplace = jest.fn();
const mockRegister = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ register: mockRegister }) }));

const fill = ({ role, email = "", password = "", confirmPassword = "" }) => {
  if (role) fireEvent.click(screen.getByRole("radio", { name: new RegExp(role, "i") }));
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: confirmPassword } });
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Create account" }));

const validInput = {
  role: "customer",
  email: "user@lokamart.id",
  password: "secret123",
  confirmPassword: "secret123",
};

beforeEach(() => {
  jest.clearAllMocks();
  render(<RegisterPage />);
});

describe("Register page", () => {
  it("AC: lets the user select customer or seller, and requires a choice", () => {
    const customer = screen.getByRole("radio", { name: /Customer/ });
    const seller = screen.getByRole("radio", { name: /Seller/ });
    expect(customer).not.toBeChecked();
    expect(seller).not.toBeChecked();

    fill({ ...validInput, role: undefined });
    submit();
    expect(screen.getByText(/customer or a seller/)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();

    fireEvent.click(seller);
    expect(seller).toBeChecked();
    expect(customer).not.toBeChecked();
  });

  it("AC: requires the email field", () => {
    fill({ ...validInput, email: "" });
    submit();
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Email is required");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("AC: requires a valid email format", () => {
    fill({ ...validInput, email: "user@invalid" });
    submit();
    expect(screen.getByLabelText("Email address")).toHaveAccessibleDescription("Enter a valid email address");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("AC: requires the password field", () => {
    fill({ ...validInput, password: "", confirmPassword: "" });
    submit();
    expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("Password is required");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("AC: requires confirm password to match password", () => {
    fill({ ...validInput, confirmPassword: "different" });
    submit();
    expect(screen.getByLabelText("Confirm password")).toHaveAccessibleDescription("Passwords do not match");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("AC: registers (which logs the user in) and redirects a customer to the customer dashboard", async () => {
    mockRegister.mockResolvedValue("customer");
    fill(validInput);
    submit();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/dashboard"));
    expect(mockRegister).toHaveBeenCalledWith(validInput);
  });

  it("AC: redirects a seller to the seller dashboard", async () => {
    mockRegister.mockResolvedValue("seller");
    fill({ ...validInput, role: "seller" });
    submit();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/seller"));
    expect(mockRegister).toHaveBeenCalledWith({ ...validInput, role: "seller" });
  });

  it("clears a field's error once the user changes that field", () => {
    submit();
    expect(screen.getByText(/customer or a seller/)).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /Seller/ }));
    expect(screen.queryByText(/customer or a seller/)).not.toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("AC: links back to the login page", () => {
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("shows a readable message when the email is already registered", async () => {
    mockRegister.mockRejectedValue({ code: "auth/email-already-in-use" });
    fill(validInput);
    submit();

    expect(await screen.findByRole("alert")).toHaveTextContent("This email is already registered");
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled();
  });

  it("disables the button while the account is being created", async () => {
    mockRegister.mockReturnValue(new Promise(() => {}));
    fill(validInput);
    submit();

    expect(await screen.findByRole("button", { name: "Creating account..." })).toBeDisabled();
  });
});

describe("Register page visuals", () => {
  it("shows the logo, role card icons and field icons", () => {
    const { container } = render(<RegisterPage />);
    expect(screen.getAllByTestId("logo-mark").length).toBeGreaterThan(0);
    for (const icon of ["shopping_bag", "storefront", "mail", "lock", "lock_reset"]) {
      expect(container.querySelector(`[data-icon="${icon}"]`)).toBeInTheDocument();
    }
  });

  it("lets the user show and hide both password fields", () => {
    const { container } = render(<RegisterPage />);
    const scoped = within(container);
    const [showPassword, showConfirm] = scoped.getAllByRole("button", { name: "Show password" });

    fireEvent.click(showPassword);
    expect(scoped.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(scoped.getByLabelText("Confirm password")).toHaveAttribute("type", "password");

    fireEvent.click(showConfirm);
    expect(scoped.getByLabelText("Confirm password")).toHaveAttribute("type", "text");
  });
});
