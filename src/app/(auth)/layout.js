import GuestOnly from "@/components/GuestOnly";

// /login and /register: logged-in users are sent to their own dashboard.
export default function AuthGroupLayout({ children }) {
  return <GuestOnly>{children}</GuestOnly>;
}
