// Each role's own dashboard: used after login/register, by the Header logo and by route protection.
export const getDashboardPath = (role) => (role === "seller" ? "/seller" : "/dashboard");
