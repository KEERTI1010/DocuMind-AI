import api from "./api";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser;
}

export async function registerUser(_fullName: string, email: string, password: string) {
  const response = await api.post("/api/auth/register", { email: email.trim(), password });
  return response.data;
}

export async function loginUser(email: string, password: string) {
  const response = await api.post<AuthResponse>("/api/auth/login", { email: email.trim(), password });
  return response.data;
}

export async function fetchMe() {
  const response = await api.get("/api/auth/me");
  return response.data.user as AuthUser;
}

export async function logoutUser() {
  await api.post("/api/auth/logout");
}
