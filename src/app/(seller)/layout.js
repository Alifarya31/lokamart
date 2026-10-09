import ProtectedShell from "@/components/ProtectedShell";

// Every page in this folder is seller only: /seller.
export default function SellerLayout({ children }) {
  return <ProtectedShell role="seller">{children}</ProtectedShell>;
}
