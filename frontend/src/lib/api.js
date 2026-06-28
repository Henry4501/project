const baseUrl = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, token, options = {}) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}
