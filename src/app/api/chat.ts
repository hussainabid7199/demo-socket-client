import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_URL,
  //   withCredentials: true,
  //   timeout: 120000,
});

const token_hc =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ3VpZCI6ImVhYTAzNDhjLTEwMGItNDYxOC04ZDVjLWJjZjk5ODM5YjA1YiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImZ1bGxOYW1lIjoiSm9obiBEZW8iLCJpYXQiOjE3NDQ4MDg0NDksImV4cCI6MTc2MDM2MDQ0OSwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIn0.pVgS0jwa14Why2GK2jsegyUeDkgtBgoAFpett6RoIck";

apiClient.interceptors.request.use(
  (config) => {
    // retrieve user token from localStorage
    const token = token_hc; // localStorage.get("token") ||
    // set authorization header with bearer
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.clientId =
      "CQCCOWWIZBRMERSNEJAROLLSZLRKMGLIHRKTWVPAUZIAXSSYUMECFQSVYTLFIVCNAPSNOZIIUTUZFF";
    return config;
  },
  (err) => Promise.reject(err)
);

export const getAllChat = async () => {
  return await apiClient.get("/chat/contact");
};

export const createChat = async (userId: number) => {
  return await apiClient.post("/chat/create", { userId: userId });
};

export const getAllUser = async () => {
  return await apiClient.get("/user");
};

export const getAllUserMessages = async (userId: number) => {
  return await apiClient.get(`/message/${userId}`);
};



