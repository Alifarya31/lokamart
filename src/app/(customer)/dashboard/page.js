// PLACEHOLDER for testing access control. Member 4 replaces this page with the customer dashboard (section d).
// Access control comes from (customer)/layout.js, so keep this file inside the (customer) folder.
// Required in every page of this route group: the page only renders after Firebase Auth confirms
// the role in the browser (see ProtectedShell), so Next cannot validate it for instant navigation.
export const instant = false;

export default function CustomerDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Customer dashboard</h1>
      <p className="mt-2 text-sm text-muted">Placeholder: recommended products and the product list go here.</p>
    </main>
  );
}
