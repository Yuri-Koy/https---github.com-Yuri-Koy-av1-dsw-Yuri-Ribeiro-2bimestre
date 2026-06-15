const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text).catch(() => text) : null;
  if (!res.ok) {
    const message = data && data.mensagem ? data.mensagem : res.statusText;
    throw new Error(message);
  }
  return data;
}

export default {
  get(path) {
    return fetch(API_BASE + path).then(handleResponse);
  },
  post(path, body) {
    return fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
  put(path, body) {
    return fetch(API_BASE + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
  patch(path, body) {
    return fetch(API_BASE + path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse);
  },
  delete(path) {
    return fetch(API_BASE + path, { method: "DELETE" }).then(handleResponse);
  },
};
