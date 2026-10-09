import { fireEvent, render, screen } from "@testing-library/react";
import { useAuth } from "@/contexts/AuthContext";
import CustomerLayout from "@/app/(customer)/layout";
import SellerLayout from "@/app/(seller)/layout";
import AuthGroupLayout from "@/app/(auth)/layout";
import CustomerDashboardPage from "@/app/(customer)/dashboard/page";
import SellerDashboardPage from "@/app/(seller)/seller/page";

const mockReplace = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));

const signedIn = (role) => ({ user: { uid: "u1" }, role, loading: false, logout: mockLogout });
const guest = { user: null, role: null, loading: false, logout: mockLogout };

beforeEach(() => jest.clearAllMocks());

// Wiring of each route group's layout to the access control table in CLAUDE.md.
describe("Route groups", () => {
  it("(customer): shows the customer dashboard with the customer header", () => {
    useAuth.mockReturnValue(signedIn("customer"));
    render(<CustomerLayout><CustomerDashboardPage /></CustomerLayout>);

    expect(screen.getByRole("heading", { name: "Customer dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cart/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("(customer): sends guests to /login and sellers to /seller", () => {
    useAuth.mockReturnValue(guest);
    const { unmount } = render(<CustomerLayout><CustomerDashboardPage /></CustomerLayout>);
    expect(mockReplace).toHaveBeenLastCalledWith("/login");
    unmount();

    useAuth.mockReturnValue(signedIn("seller"));
    render(<CustomerLayout><CustomerDashboardPage /></CustomerLayout>);
    expect(mockReplace).toHaveBeenLastCalledWith("/seller");
    expect(screen.queryByRole("heading", { name: "Customer dashboard" })).not.toBeInTheDocument();
  });

  it("(seller): shows the seller dashboard with the seller header", () => {
    useAuth.mockReturnValue(signedIn("seller"));
    render(<SellerLayout><SellerDashboardPage /></SellerLayout>);

    expect(screen.getByRole("heading", { name: "Seller dashboard" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Cart/ })).not.toBeInTheDocument();
  });

  it("(seller): sends guests to /login and customers to /dashboard", () => {
    useAuth.mockReturnValue(guest);
    const { unmount } = render(<SellerLayout><SellerDashboardPage /></SellerLayout>);
    expect(mockReplace).toHaveBeenLastCalledWith("/login");
    unmount();

    useAuth.mockReturnValue(signedIn("customer"));
    render(<SellerLayout><SellerDashboardPage /></SellerLayout>);
    expect(mockReplace).toHaveBeenLastCalledWith("/dashboard");
  });

  it("(auth): sends logged-in users away from /login and /register", () => {
    useAuth.mockReturnValue(signedIn("seller"));
    render(<AuthGroupLayout><p>Login form</p></AuthGroupLayout>);
    expect(mockReplace).toHaveBeenCalledWith("/seller");
    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
  });
});
