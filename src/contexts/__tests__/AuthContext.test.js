import { act, render, screen, waitFor } from "@testing-library/react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

jest.mock("@/lib/firebase", () => ({ auth: { name: "auth" }, db: { name: "db" } }));

jest.mock("firebase/auth", () => ({
  browserLocalPersistence: "LOCAL",
  browserSessionPersistence: "SESSION",
  sendPasswordResetEmail: jest.fn(),
  setPersistence: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn((db, collection, id) => `${collection}/${id}`),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "SERVER_TIMESTAMP"),
}));

// Captures the listener AuthProvider registers, so tests can simulate Firebase auth events.
let emitAuthState;
let latestAuth;

function Probe({ onAuth = () => {} }) {
  const value = useAuth();
  onAuth(value);
  const { user, role, loading } = value;
  return <p data-testid="state">{loading ? "loading" : `${user?.email ?? "none"}|${role ?? "none"}`}</p>;
}

const renderProvider = () =>
  render(
    <AuthProvider>
      <Probe onAuth={(value) => (latestAuth = value)} />
    </AuthProvider>
  );

beforeEach(() => {
  jest.clearAllMocks();
  onAuthStateChanged.mockImplementation((auth, callback) => {
    emitAuthState = callback;
    return jest.fn();
  });
});

describe("AuthContext", () => {
  it("stays loading until Firebase reports the first auth state, then has no user", async () => {
    renderProvider();
    expect(screen.getByTestId("state")).toHaveTextContent("loading");

    await act(() => emitAuthState(null));
    expect(screen.getByTestId("state")).toHaveTextContent("none|none");
  });

  it("loads the role from users/{uid} for an existing session", async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: "seller" }) });
    renderProvider();

    await act(() => emitAuthState({ uid: "u1", email: "seller@lokamart.id" }));
    expect(getDoc).toHaveBeenCalledWith("users/u1");
    expect(screen.getByTestId("state")).toHaveTextContent("seller@lokamart.id|seller");
  });

  it("AC: register creates the account, saves the role and logs the user in automatically", async () => {
    const newUser = { uid: "u2", email: "new@lokamart.id" };
    createUserWithEmailAndPassword.mockResolvedValue({ user: newUser });
    setDoc.mockResolvedValue();
    renderProvider();
    await act(() => emitAuthState(null));

    let returnedRole;
    await act(async () => {
      returnedRole = await latestAuth.register({
        email: " new@lokamart.id ",
        password: "secret123",
        role: "customer",
      });
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({ name: "auth" }, "new@lokamart.id", "secret123");
    expect(setDoc).toHaveBeenCalledWith("users/u2", {
      email: "new@lokamart.id",
      role: "customer",
      createdAt: "SERVER_TIMESTAMP",
    });
    expect(returnedRole).toBe("customer");
    expect(screen.getByTestId("state")).toHaveTextContent("new@lokamart.id|customer");
  });

  it("keeps the registered role when the auth listener runs before users/{uid} exists", async () => {
    const newUser = { uid: "u3", email: "seller2@lokamart.id" };
    createUserWithEmailAndPassword.mockResolvedValue({ user: newUser });
    setDoc.mockResolvedValue();
    getDoc.mockResolvedValue({ exists: () => false });
    renderProvider();
    await act(() => emitAuthState(null));

    await act(() => latestAuth.register({ email: newUser.email, password: "secret123", role: "seller" }));
    await act(() => emitAuthState(newUser));

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("seller2@lokamart.id|seller"));
  });

  it("logout signs out of Firebase", async () => {
    renderProvider();
    await act(() => latestAuth.logout());
    expect(signOut).toHaveBeenCalledWith({ name: "auth" });
  });

  it("useAuth throws outside AuthProvider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow("useAuth must be used inside <AuthProvider>");
    console.error.mockRestore();
  });
});

describe("AuthContext login", () => {
  it("AC: logs in a registered user and returns their role", async () => {
    const existing = { uid: "u4", email: "seller@lokamart.id" };
    signInWithEmailAndPassword.mockResolvedValue({ user: existing });
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: "seller" }) });
    renderProvider();
    await act(() => emitAuthState(null));

    let returnedRole;
    await act(async () => {
      returnedRole = await latestAuth.login({ email: " seller@lokamart.id ", password: "secret123" });
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({ name: "auth" }, "seller@lokamart.id", "secret123");
    expect(getDoc).toHaveBeenCalledWith("users/u4");
    expect(returnedRole).toBe("seller");
    expect(screen.getByTestId("state")).toHaveTextContent("seller@lokamart.id|seller");
  });

  it("AC: rejects an account that is not registered (Firebase error passes through)", async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-credential" });
    renderProvider();
    await act(() => emitAuthState(null));

    await expect(latestAuth.login({ email: "nobody@lokamart.id", password: "x" })).rejects.toEqual({
      code: "auth/invalid-credential",
    });
    expect(screen.getByTestId("state")).toHaveTextContent("none|none");
  });

  it("AC: rejects and signs out an auth account without a users/{uid} profile", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u5", email: "half@lokamart.id" } });
    getDoc.mockResolvedValue({ exists: () => false });
    renderProvider();
    await act(() => emitAuthState(null));

    await expect(latestAuth.login({ email: "half@lokamart.id", password: "secret123" })).rejects.toMatchObject({
      code: "auth/user-not-found",
    });
    expect(signOut).toHaveBeenCalledWith({ name: "auth" });
  });

  it("exposes a restored session only once its role has loaded", async () => {
    let resolveRole;
    getDoc.mockReturnValue(new Promise((resolve) => (resolveRole = resolve)));
    renderProvider();

    act(() => {
      emitAuthState({ uid: "u6", email: "customer@lokamart.id" });
    });
    expect(screen.getByTestId("state")).toHaveTextContent("loading");

    await act(() => resolveRole({ exists: () => true, data: () => ({ role: "customer" }) }));
    expect(screen.getByTestId("state")).toHaveTextContent("customer@lokamart.id|customer");
  });
});

describe("AuthContext approved extras", () => {
  const existing = { uid: "u7", email: "customer@lokamart.id" };

  beforeEach(() => {
    setPersistence.mockResolvedValue();
    signInWithEmailAndPassword.mockResolvedValue({ user: existing });
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ role: "customer" }) });
  });

  it.each([
    [true, "LOCAL"],
    [false, "SESSION"],
  ])("Keep me signed in = %p sets %s persistence before signing in", async (remember, persistence) => {
    renderProvider();
    await act(() => emitAuthState(null));

    await act(() => latestAuth.login({ email: existing.email, password: "secret123", remember }));

    expect(setPersistence).toHaveBeenCalledWith({ name: "auth" }, persistence);
    expect(setPersistence.mock.invocationCallOrder[0]).toBeLessThan(
      signInWithEmailAndPassword.mock.invocationCallOrder[0]
    );
  });

  it("keeps the user signed in by default", async () => {
    renderProvider();
    await act(() => emitAuthState(null));

    await act(() => latestAuth.login({ email: existing.email, password: "secret123" }));
    expect(setPersistence).toHaveBeenCalledWith({ name: "auth" }, "LOCAL");
  });

  it("resetPassword sends the Firebase reset email to the trimmed address", async () => {
    sendPasswordResetEmail.mockResolvedValue();
    renderProvider();

    await act(() => latestAuth.resetPassword(" customer@lokamart.id "));
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({ name: "auth" }, "customer@lokamart.id");
  });
});
