// A thin wrapper around fetch that targets our Express backend and attaches the
// Clerk auth token to every request. We use the native fetch API (no axios needed).
// Docs: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

// The API base URL comes from the env file (http://localhost:3000 in dev).
const baseUrl = import.meta.env.VITE_API_URL;

// token is passed in by the caller (obtained from Clerk's getToken()). Keeping
// this a plain function rather than a hook means it can be called anywhere.
export async function apiRequest(endpoint, token, options = {}) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // The backend reads this Bearer token to identify the user.
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // fetch only rejects on network failure, not on HTTP error statuses, so we
  // check res.ok ourselves and throw for 4xx/5xx responses.
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}
