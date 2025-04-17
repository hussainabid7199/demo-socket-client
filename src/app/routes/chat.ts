import UserDto from "@/dtos/user-dto";
import LoginDataModel from "@/models/LoginDataModel";
import axios, { AxiosResponse } from "axios";
import Response from "@/dtos/response";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_URL,
  //   withCredentials: true,
  //   timeout: 120000,
});

apiClient.interceptors.request.use(
  (config) => {
    // retrieve user token from localStorage
    const token = localStorage.getItem("at") || "";
    // set authorization header with bearer
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.clientid = process.env.NEXT_PUBLIC_CLIENT_ID;
    return config;
  },
  (err) => Promise.reject(err)
);

export const login = async (model: LoginDataModel): Promise<AxiosResponse<Response<UserDto>>> => {
  debugger
  return await apiClient.post<Response<UserDto>>("/account/login", model);
}


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

export const sendMessage = async (userId: number, message: string) => {
  return await apiClient.post("/message/send", { userId: userId, message: message });
};

