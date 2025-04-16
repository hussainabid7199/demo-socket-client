"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import io from "socket.io-client";
import { createChat, getAllChat, getAllUser, getAllUserMessages } from "./api/chat";
import ChatUserListDto from "@/dtos/chat-dto";
import React from "react";
import { UserSearchModal } from "@/components/user-search";
import { UserBasicDto } from "@/dtos/user-dto";
import { toast } from "sonner";
import { MessageDto } from "@/dtos/message-dto";


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ3VpZCI6ImVhYTAzNDhjLTEwMGItNDYxOC04ZDVjLWJjZjk5ODM5YjA1YiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImZ1bGxOYW1lIjoiSm9obiBEZW8iLCJpYXQiOjE3NDQ4MDg0NDksImV4cCI6MTc2MDM2MDQ0OSwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIn0.pVgS0jwa14Why2GK2jsegyUeDkgtBgoAFpett6RoIck";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ["websocket"],
  auth: {
    token: token
  },
});

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [chatList, setChatList] = useState<ChatUserListDto[]>([])
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageText, setMessageText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userList, setUserList] = useState<UserBasicDto[]>([])
  const [selectedModelUser, setSelectedModelUser] = useState<UserBasicDto>();

  socket.on("group_created", (data) => {
    console.log("Group created!", data);
    const { groupId, name, createdBy } = data;
    console.log({ socketData: { groupId, name, createdBy } });
  });
  socket.on("connected_to_room", (data) => {
    console.log("connected_to_room", data);
  });
  socket.on("from_ioc", (data) => {
    console.log("from_ioc", data);
  });

  socket.on("newChat", (data) => {
    console.log("newChat", data);
  });

  useEffect(() => {
    // socket.on("from-server", (message: Message) => {
    //   setMessages((prev) => [...prev, message]);
    // });

    return () => {
      socket.off("from-server");
    };

  }, []);

  useEffect(() => {
    (async () => {
      const response = await getAllUser();
      if (response && response.data.data && response.data.data.length > 0 && response.status) {
        setUserList(response.data.data)
      }
    })();

    (async () => {
      const response = await getAllChat();
      if (response && response.data.data && response.data.data.length > 0 && response.status) {
        setChatList(response.data.data)
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (selectedUser && selectedUser > 0) {
          const response = await getAllUserMessages(selectedUser);
          if (response && response.data.data && response.status) {
            setMessages(response.data.data)
          }
        }

      } catch (error) {
        setSelectedUser(0);
        console.log("res 1", error)
      }
    })();


    (async () => {
      try {
        if (selectedModelUser) {
          debugger
          const response = await createChat(selectedModelUser.id);
          console.log("response 2", response)
          debugger
          if (response && response.data.data && response.status) {
            debugger
            toast.success("Chat created successfully")
          } else {
            debugger
            toast.warning("Chat already exist")
          }
        }
      } catch (error) {
        setSelectedUser(0);
        console.log("res 2", error)
      }
    })();
  }, [selectedUser, selectedModelUser])



  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Chat App</h2>
        <ul>
          {chatList.map((user, index) => {
            return (
              <React.Fragment key={index}>
                <li
                  key={user.id}
                  className={`p-2 cursor-pointer ${selectedUser === user.id ? "bg-gray-300" : ""}`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.firstName + " " + user.lastName}
                </li>
              </React.Fragment>
            )
          })}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-col w-3/4">
        <div className="py-2 px-3 flex justify-end">
          <Button onClick={() => setModalOpen(true)}>Search User</Button>
          <UserSearchModal
            users={userList}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSelect={(user) => setSelectedModelUser(user)}
          />
        </div>
        <Card className="flex-1 overflow-y-auto p-4 border">
          <CardContent>
            <div className="flex flex-col space-y-2">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.currentUserId === 1;
                return (
                  <div
                    key={index}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
                px-4 py-2 rounded-lg shadow 
                ${isCurrentUser ? 'bg-green-200 text-right rounded-br-none' : 'bg-white text-left rounded-bl-none'}
              `}
                    >
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>


        {/* Input Field */}
        <div className="flex mt-4">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 mr-2"
          />
          <Button disabled={!selectedUser}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
