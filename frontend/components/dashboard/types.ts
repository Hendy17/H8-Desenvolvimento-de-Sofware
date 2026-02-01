export interface User {
  id: string;
  email: string;
  tenantDbName?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  tenantDbName?: string;
}

export type DashboardState = {
  token: string | null;
};