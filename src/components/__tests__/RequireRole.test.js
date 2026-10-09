import { render, screen } from "@testing-library/react";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/contexts/AuthContext";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));

const renderAs = (auth, role = "customer") => {
  useAuth.mockReturnValue(auth);
  render(
    <RequireRole role={role}>
      <p>Protected content</p>
    </RequireRole>
  );
};

const customer = { user: { uid: "c1" }, role: "customer", loading: false };
const seller = { user: { uid: "s1" }, role: "seller", loading: false };

beforeEach(() => jest.clearAllMocks());

describe("RequireRole", () => {
  it("shows a loading skeleton and does not redirect while Firebase is loading", () => {
    renderAs({ user: null, role: null, loading: true });
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("does not redirect a signed-in user whose role is still loading", () => {
    renderAs({ user: { uid: "c1" }, role: null, loading: false });
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to /login when not logged in", () => {
    renderAs({ user: null, role: null, loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("redirects a seller on a customer page to the seller dashboard", () => {
    renderAs(seller, "customer");
    expect(mockReplace).toHaveBeenCalledWith("/seller");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects a customer on a seller page to the customer dashboard", () => {
    renderAs(customer, "seller");
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("shows the page to a user with the right role", () => {
    renderAs(customer, "customer");
    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(screen.queryByRole("status", { name: "Loading" })).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
