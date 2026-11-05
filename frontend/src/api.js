const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
const tokenKey = "rc_access_token";

export function saveToken(token) { localStorage.setItem(tokenKey, token); }
export function clearToken() { localStorage.removeItem(tokenKey); }
export function getToken() { return localStorage.getItem(tokenKey); }

async function request(path, init = {}) {
  const token = getToken();
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined;
  return response.json();
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  saveProfile: (profile) =>
    request("/profile", { method: "PUT", body: JSON.stringify({
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
      trainingDaysPerWeek: profile.trainingDaysPerWeek,
      stepTarget: profile.stepTarget
    }) }),
  getProfile: () => request("/profile"),
  logMeal: (meal) =>
    request("/nutrition/meals", { method: "POST", body: JSON.stringify(meal) }),
  estimateMeal: (description) =>
    request("/nutrition/estimate", {
      method: "POST", body: JSON.stringify({ description })
    }),
  logWeight: (weightKg) =>
    request("/progress/weight", { method: "POST", body: JSON.stringify({ weightKg }) }),
  logSteps: (steps) =>
    request("/progress/steps", { method: "POST", body: JSON.stringify({ steps }) })
};
