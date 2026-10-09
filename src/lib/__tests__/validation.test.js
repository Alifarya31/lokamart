import { validateEmail, validateLogin, validatePassword, validateRegister } from "@/lib/validation";

const validForm = {
  role: "customer",
  email: "user@lokamart.id",
  password: "secret123",
  confirmPassword: "secret123",
};

describe("validateEmail", () => {
  it("requires an email", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("   ")).toBe("Email is required");
  });

  it.each(["user", "user@", "user@invalid", "@lokamart.id", "us er@lokamart.id"])(
    "rejects the invalid format %p",
    (email) => {
      expect(validateEmail(email)).toBe("Enter a valid email address");
    }
  );

  it("accepts a valid email", () => {
    expect(validateEmail("user@lokamart.id")).toBe("");
  });
});

describe("validatePassword", () => {
  it("requires a password", () => {
    expect(validatePassword("")).toBe("Password is required");
    expect(validatePassword("x")).toBe("");
  });
});

describe("validateRegister", () => {
  it("returns no errors for a valid form", () => {
    expect(validateRegister(validForm)).toEqual({});
  });

  it("AC: requires choosing customer or seller", () => {
    expect(validateRegister({ ...validForm, role: "" }).role).toMatch(/customer or a seller/);
    expect(validateRegister({ ...validForm, role: "admin" }).role).toMatch(/customer or a seller/);
    expect(validateRegister({ ...validForm, role: "seller" })).toEqual({});
  });

  it("AC: requires an email", () => {
    expect(validateRegister({ ...validForm, email: "" }).email).toBe("Email is required");
  });

  it("AC: requires a valid email format", () => {
    expect(validateRegister({ ...validForm, email: "user@invalid" }).email).toBe("Enter a valid email address");
  });

  it("AC: requires a password", () => {
    expect(validateRegister({ ...validForm, password: "", confirmPassword: "" }).password).toBe(
      "Password is required"
    );
  });

  it("AC: requires confirm password to match password", () => {
    expect(validateRegister({ ...validForm, confirmPassword: "different" }).confirmPassword).toBe(
      "Passwords do not match"
    );
  });
});

describe("validateLogin", () => {
  const validLogin = { email: "user@lokamart.id", password: "secret123" };

  it("returns no errors for a valid form", () => {
    expect(validateLogin(validLogin)).toEqual({});
  });

  it("AC: requires an email", () => {
    expect(validateLogin({ ...validLogin, email: "" }).email).toBe("Email is required");
  });

  it("AC: requires a valid email format", () => {
    expect(validateLogin({ ...validLogin, email: "user@invalid" }).email).toBe("Enter a valid email address");
  });

  it("AC: requires a password", () => {
    expect(validateLogin({ ...validLogin, password: "" }).password).toBe("Password is required");
  });
});
