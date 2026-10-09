import { render, screen } from "@testing-library/react";
import GuestOnly from "@/components/GuestOnly";
import { useAuth } from "@/contexts/AuthContext";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));

const renderAs = (auth) => {
  useAuth.mockReturnValue(auth);
  render(
    <GuestOnly>
      <p>Login form</p>
    </GuestOnly>
  );
};

beforeEach(() => jest.clearAllMocks());

describe("GuestOnly", () => {
  it("shows the page to guests, even while Firebase is still loading", () => {
    renderAs({ user: null, role: null, loading: true });
    expect(screen.getByText("Login form")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects a logged-in customer to the customer dashboard", () => {
    renderAs({ user: { uid: "c1" }, role: "customer", loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    expect(screen.queryByText("Login form")).not.toBeInTheDocument();
  });

  it("redirects a logged-in seller to the seller dashboard", () => {
    renderAs({ user: { uid: "s1" }, role: "seller", loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/seller");
  });

  it("waits for the role before redirecting a freshly signed-in user", () => {
    renderAs({ user: { uid: "s1" }, role: null, loading: false });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
