import fs from "fs";
import path from "path";

// Pages in the protected route groups only render after Firebase Auth confirms the role, so Next's
// instant-navigation validation reports them as "dropped". Each page must opt out with
// `export const instant = false` (a layout-level export does not cover pages). This test fails when a
// new protected page forgets it, or turns page.js into a Client Component (where `instant` is not allowed).
const APP_DIR = path.join(__dirname, "..");
const PROTECTED_GROUPS = ["(customer)", "(seller)"];

const findPages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "__tests__" ? [] : findPages(full);
    return entry.name === "page.js" ? [full] : [];
  });

const pages = PROTECTED_GROUPS.flatMap((group) => findPages(path.join(APP_DIR, group)));

describe("Protected pages", () => {
  it("finds the protected pages", () => {
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });

  it.each(pages.map((file) => [path.relative(APP_DIR, file), file]))(
    "%s opts out of instant-navigation validation as a Server Component",
    (relative, file) => {
      const source = fs.readFileSync(file, "utf8");
      expect(source).toMatch(/^export const instant = false;$/m);
      expect(source).not.toMatch(/^["']use client["']/m);
    }
  );
});
