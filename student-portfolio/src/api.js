
const API_BASE_URL = "http://localhost:5000";

async function apiRequest(path, options = {}, settings = {}) {
  const {
    auth = true,
    redirectOnUnauthorized = true,
  } = settings;

  const token = sessionStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && redirectOnUnauthorized) {
    sessionStorage.removeItem("token");

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

export function registerUser(email, password) {
  return apiRequest(
    "/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { auth: false, redirectOnUnauthorized: false }
  );
}

export function loginUser(email, password) {
  return apiRequest(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    { auth: false, redirectOnUnauthorized: false }
  );
}

export function getCurrentUser() {
  return apiRequest("/me");
}

export function getTasks() {
  return apiRequest("/tasks");
}

export function createTask(task) {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, task) {
  return apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(id) {
  return apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  });
}
