
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    createChat,
    getAllChat,
    getAllUser,
    getAllUserMessages,
    sendMessage,
} from "@/app/routes/chat";
import React from "react";
import { UserSearchModal } from "@/components/user-search";
import { UserBasicDto } from "@/dtos/user-dto";
import { toast } from "sonner";
import { MessageDto, MessageSendDto } from "@/dtos/message-dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "@/context/socket-context";
import Logout from "../logout";
import { useSession } from "next-auth/react";
import { ContactDto } from "@/dtos/contact-dto";
import { MessageDataModel } from "@/models/MessageDataModel";


export default function Chat() {
    const { data: session } = useSession();
    const [selectedUser, setSelectedUser] = useState<ContactDto>();
    const [chatList, setChatList] = useState<ContactDto[]>([]);
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [currentMessages, setCurrentMessages] = useState<MessageSendDto[]>([]);
    const [messageText, setMessageText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [userList, setUserList] = useState<UserBasicDto[]>([]);
    const [selectedModelUser, setSelectedModelUser] = useState<UserBasicDto>();


    const { socket, isConnected, joinRoom, leaveRoom, currentRoomId } = useSocket();

    useEffect(() => {
        console.log("currentRoomId", currentRoomId);
        if (selectedUser?.roomId) {
            joinRoom(selectedUser.roomId);
        }
        console.log("leaveRoom", leaveRoom);
    }, [selectedUser?.roomId, joinRoom]);



    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            const response = await getAllUser();
            if (response?.data?.data?.length > 0 && response.status) {
                setUserList(response.data.data);
            }
        })();

        (async () => {
            const response = await getAllChat();
            if (response?.data?.data?.length > 0 && response.status) {
                setChatList(response.data.data);
            }
        })();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedUser && selectedUser.chatId && selectedUser.roomId && selectedUser.userId) {
                try {
                    const response = await getAllUserMessages(selectedUser.chatId, selectedUser.userId);
                    if (response?.data?.data && response.status) {
                        setMessages(response.data.data);
                    }else{
                        setMessages([]);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                    toast.error('Failed to load messages');
                }
            }
        };

        const createChatForModelUser = async () => {
            if (selectedModelUser) {
                try {
                    const response = await createChat(selectedModelUser.id);
                    if (response?.data?.data && response.status) {
                        toast.success("Chat created successfully");
                    } else {
                        toast.warning("Chat already exists");
                    }
                } catch (error) {
                    console.error('Error creating chat:', error);
                    toast.error('Failed to create chat');
                }
            }
        };

        // Sequential execution
        const handleChatAndMessages = async () => {
            await fetchMessages();  // Fetch messages first
            await createChatForModelUser(); // Then create chat
        };

        handleChatAndMessages();
    }, [selectedUser, selectedModelUser]);

    const onSubmit = async () => {
        if (messageText && selectedUser && selectedUser.chatId > 0 && socket) {
            // socket.emit("to-server", { message: messageText });
            const message: MessageDataModel = {
                chatId: selectedUser.chatId,
                message: messageText,
                messageType: "TEXT",
                senderId: session?.user.id
            }
            const response = await sendMessage(message);
            if (response?.data?.data && response.status) {
                toast.success("Message sent successfully");
                setMessageText("");
            } else {
                toast.warning("Message not sent");
            }
        }
    };

    useEffect(() => {
        const handleNewChat = (message: MessageSendDto) => {
            setCurrentMessages((prev) => [...prev, message]);
        };

        if (socket) {
            socket.on("newChat", handleNewChat);
            return () => {
                socket.off("newChat", handleNewChat);
            };
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        }, 100);

        return () => clearTimeout(timer); // Cleanup
    }, [messages, currentMessages]);

    return (
        <div className="flex h-screen font-sans">
            <div className="w-1/4 bg-[#075E54] p-4 text-white overflow-y-auto">
                <h2 className="text-xl font-semibold mb-6">Chats</h2>
                <ul className="space-y-2">
                    {chatList.map((user) => (
                        <li
                            key={user.userId}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedUser === user.userId
                                ? "bg-[#128C7E]"
                                : "hover:bg-[#0B7366]"
                                }`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {user.fullName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col w-3/4 bg-[#ECE5DD] relative">
                <div className="py-3 px-4 flex justify-between items-center bg-[#128C7E] text-white shadow-sm">
                    <Button variant="secondary" onClick={() => setModalOpen(true)}>
                        Search User
                    </Button>
                    <Logout />
                    <UserSearchModal
                        users={userList}
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSelect={(user) => setSelectedModelUser(user)}
                    />
                </div>

                <Card className="flex-1 overflow-hidden px-4 pt-6 pb-28 bg-transparent shadow-none">
                    <CardContent className="flex flex-col space-y-3 overflow-y-scroll hide-scrollbar max-h-full">
                        <div
                            className="flex flex-col space-y-3 py-1"
                            ref={messageEndRef}
                        >
                            {[...messages, ...currentMessages].map((msg, index) => {
                                const isCurrentUser =
                                    "currentUserId" in msg
                                        ? msg.currentUserId === session?.user.id
                                        : msg.senderId === selectedUser?.userId;
                                const content: string | File =
                                    "message" in msg ? msg.message : msg.payload;
                                const createdAt =
                                    "createdAt" in msg ? msg.createdAt : new Date().toISOString();

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl shadow ${isCurrentUser
                                                ? "bg-[#DCF8C6] text-right rounded-br-none"
                                                : "bg-white text-left rounded-bl-none"
                                                }`}
                                        >
                                            {typeof content === "string" ? (
                                                <div className="text-sm break-words whitespace-pre-wrap">
                                                    {content}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-blue-600 underline cursor-pointer">
                                                    File received
                                                </div>
                                            )}
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {new Date(createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="absolute bottom-0 w-full flex items-center p-4 bg-white shadow-md">
                    <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSubmit();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 mr-2"
                    />
                    <Button disabled={!selectedUser && isConnected} onClick={onSubmit} size="icon">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            </div>
        </div>
    );
}