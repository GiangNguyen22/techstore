// src/components/Admin/AdminChatPage.tsx
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import AdminChatBox from "./AdminChatBox";

// Kiểu cho tin nhắn
interface Message {
  senderName: string;
  receiverName: string;
  message: string;
  date?: string;
}

const socket: Socket = io("http://localhost:3000"); // ⚠️ nhớ thay bằng URL thực tế

const AdminChatPage: React.FC = () => {
  const [showChat, setShowChat] = useState(true);
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [message, setMessage] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("clients", (clientList: string[]) => {
      setClients(clientList);
    });

    socket.on("message-from-client", (data: Message) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (!updated[data.senderName]) updated[data.senderName] = [];
        updated[data.senderName].push(data);
        return updated;
      });

      if (selectedClient !== data.senderName) {
        setUnreadCount((prev) => ({
          ...prev,
          [data.senderName]: (prev[data.senderName] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("clients");
      socket.off("message-from-client");
    };
  }, [selectedClient]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, selectedClient]);

  const handleSelectClient = (client: string) => {
    setSelectedClient(client);
    setUnreadCount((prev) => ({ ...prev, [client]: 0 }));

    if (!messages[client]) {
      setIsLoadingHistory(true);
      socket.emit("get-message-history", client);
      socket.once("message-history", (history: Message[]) => {
        setMessages((prev) => ({
          ...prev,
          [client]: history,
        }));
        setIsLoadingHistory(false);
      });
    }
  };

  const sendMessage = () => {
    if (selectedClient && message.trim()) {
      const msgData: Message = {
        senderName: "admin",
        receiverName: selectedClient,
        message: message.trim(),
        date: new Date().toISOString(),
      };

      socket.emit("message-from-admin", msgData);

      setMessages((prev) => {
        const updated = { ...prev };
        if (!updated[selectedClient]) updated[selectedClient] = [];
        updated[selectedClient].push(msgData);
        return updated;
      });

      setMessage("");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <AdminChatBox
        showChat={showChat}
        setShowChat={setShowChat}
        clients={clients}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        unreadCount={unreadCount}
        handleSelectClient={handleSelectClient}
        isLoadingHistory={isLoadingHistory}
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        chatBodyRef={chatBodyRef}
      />
    </div>
  );
};

export default AdminChatPage;
