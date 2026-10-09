import { render } from "@testing-library/react";
import Home from "@/app/page";
import { useAuth } from "@/contexts/AuthContext";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockReplace }) }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));

const renderAs = (auth) => {
  useAuth.mockReturnValue(auth);
  render(<Home />);
};

beforeEach(() => jest.clearAllMocks());

describe("Root page /", () => {
  it("waits while Firebase is loading", () => {
    renderAs({ user: null, role: null, loading: true });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("waits for the role of a freshly signed-in user", () => {
    renderAs({ user: { uid: "u1" }, role: null, loading: false });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("sends guests to /login", () => {
    renderAs({ user: null, role: null, loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/login");
  });

  it("sends a logged-in customer to /dashboard", () => {
    renderAs({ user: { uid: "c1" }, role: "customer", loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("sends a logged-in seller to /seller", () => {
    renderAs({ user: { uid: "s1" }, role: "seller", loading: false });
    expect(mockReplace).toHaveBeenCalledWith("/seller");
  });
});
