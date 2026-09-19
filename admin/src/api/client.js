import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Send httpOnly cookie with every request
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor — redirect to login on 401 ────────────────────────
// NOTE: We skip the redirect for /auth/me because that endpoint returns 401
// when no session exists (expected behavior on first load). Redirecting there
// would cause an infinite reload loop: me() → 401 → /login → reload → me() → ...
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSessionCheck = error.config?.url === "/auth/me";
    if (error.response?.status === 401 && !isSessionCheck) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login:  (email, password) => api.post("/auth/login",  { email, password }),
  logout: ()                => api.post("/auth/logout"),
  me:     ()                => api.get("/auth/me"),
};

// ── Content ────────────────────────────────────────────────────────────────
export const contentApi = {
  getAll:         ()                    => api.get("/content"),
  getSection:     (section)             => api.get(`/content/${section}`),
  updateSection:  (section, data)       => api.put(`/content/${section}`, data),
};

// ── Contacts ───────────────────────────────────────────────────────────────
export const contactsApi = {
  getAll:   (unreadOnly = false) => api.get(`/contacts${unreadOnly ? "?unread=true" : ""}`),
  markRead: (id)                 => api.patch(`/contacts/${id}/read`),
  delete:   (id)                 => api.delete(`/contacts/${id}`),
};

// ── Upload ─────────────────────────────────────────────────────────────────
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview:   () => api.get("/analytics/overview"),
  clearAll:      () => api.delete("/analytics/clear"),
  deleteSession: (sessionId) => api.delete(`/analytics/sessions/${sessionId}`),
};

export default api;

