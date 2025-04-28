import UserDto from "@/dtos/user-dto";
import LoginDataModel from "@/models/LoginDataModel";
import axios, { AxiosResponse } from "axios";
import Response from "@/dtos/response";
import { MessageDto } from "@/dtos/message-dto";
import { MessageDataModel } from "@/models/MessageDataModel";
import ChatDto from "@/dtos/chat-dto";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  //   withCredentials: true,
  //   timeout: 120000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("at") || "";
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.clientid = process.env.NEXT_PUBLIC_CLIENT_ID;
    return config;
  },
  (err) => Promise.reject(err)
);

export const login = async (model: LoginDataModel): Promise<AxiosResponse<Response<UserDto>>> => {
  return await apiClient.post<Response<UserDto>>("/account/login", model);
}


export const getAllChat = async () => {
  return await apiClient.get("/chat/contact");
};

export const createChat = async (userId: number): Promise<AxiosResponse<Response<ChatDto>>> => {
  return await apiClient.post("/chat/private", { userId: userId });
};

export const getAllUser = async () => {
  return await apiClient.get("/user");
};

export const getAllUserMessages = async (chatId: number, userId: number) => {
  return await apiClient.get(`/message/${chatId}/${userId}`);
};

export const sendMessage = async (model: MessageDataModel): Promise<AxiosResponse<Response<MessageDto>>> => {
  return await apiClient.post("/message/send", model);
}
