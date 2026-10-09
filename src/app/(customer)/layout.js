import ProtectedShell from "@/components/ProtectedShell";

// Every page in this folder is customer only: /dashboard, /products/[id], /cart, /orders.
export default function CustomerLayout({ children }) {
  return <ProtectedShell role="customer">{children}</ProtectedShell>;
}
