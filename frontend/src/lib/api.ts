import "server-only";
import { apiUrl } from "./api-url";
import { readSessionToken } from "./session";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await readSessionToken();
  // TODO A: si falta el token, volver al login antes de consultar NestJS.

  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  // TODO A: si NestJS responde sin autorización por sesión (401), volver al login.
  return response;
}
