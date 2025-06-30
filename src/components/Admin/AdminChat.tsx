import React, { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import { useAdminChat } from "./AdminChatProvider";

interface MessageType {
  senderName: string;
  receiverName: string;
  message: string;
  timestamp?: string;
}

const COLORS = [
  "bg-gradient-to-tr from-green-400 to-blue-500",
  "bg-gradient-to-tr from-pink-500 to-orange-400",
  "bg-gradient-to-tr from-purple-500 to-indigo-500",
  "bg-gradient-to-tr from-yellow-400 to-red-400",
  "bg-gradient-to-tr from-cyan-400 to-blue-600",
  "bg-gradient-to-tr from-fuchsia-500 to-pink-500",
];

function getColor(idx: number): string {
  return COLORS[idx % COLORS.length];
}

const AdminChat: React.FC = () => {
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const selectedClientRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<Record<string, MessageType[]>>({});
  const [message, setMessage] = useState<string>("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // SỬ DỤNG HOOK context
const { unreadCount, resetUnread, setActiveChatUser } = useAdminChat();

  const totalUnread = (Object.values(unreadCount) as number[]).reduce(
    (sum, count) => sum + count,
    0
  );

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Nhận message realtime từ WebSocket, luôn đảm bảo có timestamp
  const onMessageReceived = useCallback((msg: IMessage) => {
    const raw = JSON.parse(msg.body);
    const payload: MessageType = {
      senderName: raw.senderName,
      receiverName: raw.receiverName,
      message: raw.message,
      timestamp: raw.timestamp || "", // luôn có trường timestamp
    };
    const { senderName, receiverName, message, timestamp } = payload;
    const chatPartner = senderName === "admin" ? receiverName : senderName;

    setMessages((prev) => {
      const existing = prev[chatPartner] || [];
      // Duplicate: kiểm tra luôn timestamp
      const isDuplicate = existing.some(
        (m: MessageType) =>
          m.senderName === senderName &&
          m.receiverName === receiverName &&
          m.message === message &&
          m.timestamp === timestamp
      );
      if (isDuplicate) return prev;

      return {
        ...prev,
        [chatPartner]: [...existing, payload],
      };
    });

    setClients((prev) =>
      prev.includes(chatPartner) ? prev : [...prev, chatPartner]
    );
    // KHÔNG xử lý unread tại đây, đã có Provider xử lý
  }, []);

  // Lấy danh sách client đã nhắn với admin
  const fetchClients = useCallback(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/chat/users-chatted-with-admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok && res.status !== 204 ? res.json() : []))
      .then((data: string[]) => setClients(data))
      .catch((err) => console.error("Error fetching clients:", err));
  }, [token]);

  // Lấy lịch sử chat với client và map lại về chuẩn timestamp
  const fetchHistory = useCallback(
    (client: string) => {
      if (!token || !client) return;
      setIsLoadingHistory(true);
      fetch(`http://localhost:8080/api/chat/history/admin/${client}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok && res.status !== 204 ? res.json() : []))
        .then((data: any[]) => {
          const normalized: MessageType[] = data.map((msg: any) => ({
            senderName: msg.sender,
            receiverName: msg.receiver,
            message: msg.message,
            timestamp: msg.timestamp || "", // đồng bộ chỉ dùng timestamp
          }));
          setMessages((prev) => ({ ...prev, [client]: normalized }));
        })
        .finally(() => setIsLoadingHistory(false))
        .catch((err) => console.error("Error loading history:", err));
    },
    [token]
  );

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe("/user/admin/private", onMessageReceived);
      },
      onStompError: (error) => {
        console.error("STOMP error:", error);
      },
    });

    client.activate();
    stompClientRef.current = client;

    const cleanup = () => client.deactivate();

    window.addEventListener("beforeunload", cleanup);
    return () => {
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [onMessageReceived]);

  useEffect(() => {
    if (selectedClient) fetchHistory(selectedClient);
  }, [selectedClient, fetchHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages[selectedClient || ""]?.length]);

  // Gửi message cho client
  const sendMessage = () => {
    if (!stompClientRef.current || !selectedClient || !message.trim()) return;

    const msg: MessageType = {
      senderName: "admin",
      receiverName: selectedClient,
      message: message.trim(),
      // Không gán timestamp ở đây, để backend sinh và trả về qua socket
    };

    stompClientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify(msg),
    });

    setMessage("");
  };

  const handleSelectClient = (client: string) => {
    resetUnread(client); // dùng context, không cần setUnreadCount ở đây nữa
    setSelectedClient(client);
    setActiveChatUser(client); 
    selectedClientRef.current = client;
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-pink-100">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-500 via-pink-300 to-orange-300 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-white drop-shadow">
            💬 Admin Chat
          </span>
          {totalUnread > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-1 animate-bounce">
              {totalUnread} mới
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-white/70 rounded-xl shadow text-blue-700 hover:bg-white font-bold transition"
        >
          ⬅ Quay về trang chủ
        </button>
      </div>
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex flex-col p-4 bg-gradient-to-tl from-blue-100 via-pink-50 to-yellow-50 shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            Khách hàng
          </h3>
          <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
            {clients.length === 0 && (
              <li className="text-gray-400 italic">
                Chưa có khách hàng nào nhắn tới...
              </li>
            )}
            {clients.map((client, i) => (
              <li
                key={client}
                onClick={() => handleSelectClient(client)}
                className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition shadow hover:scale-105 ${
                  selectedClient === client
                    ? "bg-gradient-to-r from-blue-400 via-pink-300 to-orange-200 text-white font-bold"
                    : getColor(i) +
                      " text-gray-900 font-semibold hover:opacity-90"
                }`}
              >
                <span>{client}</span>
                {unreadCount[client] > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5 ml-2 animate-pulse">
                    {unreadCount[client]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white/50 rounded-l-3xl shadow-lg">
          <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50">
            <strong className="text-lg text-blue-600">Đang chat với:</strong>{" "}
            <span className="font-semibold text-pink-600">
              {selectedClient || (
                <span className="italic text-gray-400">
                  Chưa chọn khách hàng
                </span>
              )}
            </span>
          </div>
          <div
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto p-6 space-y-3"
            style={{ minHeight: 0 }}
          >
            {isLoadingHistory ? (
              <p className="text-gray-500 italic animate-pulse">
                Đang tải lịch sử chat...
              </p>
            ) : (
              selectedClient &&
              (messages[selectedClient] || []).map(
                (msg: MessageType, idx: number) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-${
                      msg.senderName === "admin" ? "end" : "start"
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {msg.senderName === "admin" ? "Admin" : msg.senderName} ➡{" "}
                      {msg.receiverName} |{" "}
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                    <span
                      className={`px-4 py-2 rounded-2xl shadow-md max-w-[70%] break-words ${
                        msg.senderName === "admin"
                          ? "bg-gradient-to-br from-green-300 to-blue-200 text-right text-blue-900"
                          : "bg-gradient-to-tl from-pink-200 to-orange-100 text-left text-gray-800"
                      }`}
                    >
                      {msg.message}
                    </span>
                  </div>
                )
              )
            )}
          </div>
          <div className="p-4 border-t border-blue-200 flex items-center gap-3 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-1 px-4 py-2 rounded-xl border border-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-gradient-to-tr from-pink-400 to-orange-400 text-white font-bold rounded-xl shadow hover:scale-105 transition"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
