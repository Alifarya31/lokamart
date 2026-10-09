import { validateEmail, validateLogin, validatePassword, validateProduct, validateRegister } from "@/lib/validation";

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

describe("validateProduct (section c: Add new product)", () => {
  const validProduct = {
    name: "Matte Stoneware Dripper",
    price: "185000",
    stock: "12",
    category: "Tableware",
    description: "Hand-thrown dripper.",
  };

  it("returns no errors for a valid product", () => {
    expect(validateProduct(validProduct)).toEqual({});
  });

  it("AC: requires a product name of more than 5 characters", () => {
    expect(validateProduct({ ...validProduct, name: "Lamp" }).name).toMatch(/more than 5 characters/);
    expect(validateProduct({ ...validProduct, name: "Lamps" }).name).toMatch(/more than 5 characters/);
    expect(validateProduct({ ...validProduct, name: "   Lamps   " }).name).toMatch(/more than 5 characters/);
    expect(validateProduct({ ...validProduct, name: "Lamp 1" }).name).toBeUndefined();
  });

  it.each(["", "0", "-5", "abc"])("AC: requires stock greater than 0 (%p fails)", (stock) => {
    expect(validateProduct({ ...validProduct, stock }).stock).toMatch(/greater than 0/);
  });

  it("requires whole units of stock", () => {
    expect(validateProduct({ ...validProduct, stock: "2.5" }).stock).toMatch(/whole number/);
  });

  it.each(["", "0", "-1000", "abc"])("AC: requires price greater than 0 (%p fails)", (price) => {
    expect(validateProduct({ ...validProduct, price }).price).toBe("Price must be greater than 0");
  });

  it("AC: requires a category", () => {
    expect(validateProduct({ ...validProduct, category: "" }).category).toBe("Select a category");
  });

  it("AC: requires a description", () => {
    expect(validateProduct({ ...validProduct, description: "   " }).description).toBe("Enter a product description");
  });
});
