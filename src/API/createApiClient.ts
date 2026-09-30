import axios from "axios";

const TOKEN_STORAGE_KEY = "authToken";

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Accept: "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  });

  return client;
}
