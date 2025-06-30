import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface UserChatPopupProps {
  authToken: string;
  username: string;
}

const UserChatPopup: React.FC<UserChatPopupProps> = ({
  authToken,
  username,
}) => {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  console.log(messages);
  useEffect(() => {
    if (!authToken || !username) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/chat/history/${username}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }

        const data = await res.json();

        const normalized = data.map((msg: any) => ({
          ...msg,
          senderName: msg.sender,
          receiverName: msg.receiver,
        }));

        setMessages(normalized);
      } catch (err: any) {
        console.error("Lỗi lấy lịch sử chat:", err.message);
      }
    };

    fetchHistory();

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe(`/user/${username}/private`, (msg) => {
          const payload = JSON.parse(msg.body);

          // Chuẩn hóa trường timestamp để dùng duy nhất
          payload.timestamp = payload.timestamp || payload.date || "";

          setMessages((prev) => {
            const isDuplicate = prev.some(
              (m) =>
                m.message === payload.message &&
                m.senderName === payload.senderName &&
                m.receiverName === payload.receiverName &&
                m.timestamp === payload.timestamp 
            );
            if (isDuplicate) return prev;
            return [...prev, payload];
          });

          // TĂNG unread CHỈ KHI sender là 'admin'
          if (payload.senderName === "admin" && !open) {
            setUnreadCount((prev) => prev + 1);
          }
        });

        client.publish({
          destination: "/app/message",
          body: JSON.stringify({ senderName: username, status: "JOIN" }),
        });
      },

      onStompError: (err) => {
        console.error("STOMP error", err);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [authToken, username, open]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!isConnected || !stompClient) {
      console.warn("WebSocket chưa kết nối. Không thể gửi tin nhắn.");
      return;
    }

    if (message.trim() === "") return;

    const msg = {
      senderName: username,
      receiverName: "admin",
      message,
    };

    stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify(msg),
    });

    setMessage("");
  };

  return (
    <>
      {/* Nút mở chat */}
      <div
        className="fixed bottom-16 right-6 w-14 h-14 bg-gradient-to-tr from-blue-500 via-pink-400 to-orange-400 text-white text-3xl flex items-center justify-center rounded-full cursor-pointer z-50 shadow-lg border-4 border-white hover:scale-110 transition"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnreadCount(0);
        }}
      >
        💬
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="fixed bottom-32 right-6 w-80 max-w-[95vw] h-[440px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-pink-300 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-pink-400 to-orange-400 text-white py-3 px-5 font-bold flex items-center justify-between">
            <span>Support Chat</span>
            <button
              className="text-white text-xl font-bold hover:text-pink-200"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Nội dung chat */}
          <div
            ref={chatBodyRef}
            className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-pink-50 text-sm space-y-2"
          >
            {messages.map((msg, index) => {
              const isUser = msg.senderName === username;
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {msg.timestamp && (
                      <div className="text-xs text-gray-400 mb-1 select-none">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    <span
                      className={`px-4 py-2 rounded-2xl max-w-[150px] break-words shadow block ${
                        isUser
                          ? "bg-gradient-to-tr from-green-300 to-blue-200 text-right text-blue-900"
                          : "bg-gradient-to-tl from-pink-200 to-orange-100 text-left text-gray-800"
                      }`}
                    >
                      {msg.message}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="flex border-t border-pink-200 p-3 bg-gradient-to-r from-blue-50 via-white to-pink-50">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 px-3 py-2 border border-pink-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-pink-400 shadow"
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-5 py-2 bg-gradient-to-tr from-pink-400 to-orange-400 text-white rounded-lg font-bold shadow hover:scale-105 transition"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeInUp 0.3s;
        }
        @keyframes fadeInUp {
          0% { transform: translateY(30px); opacity: 0;}
          100% { transform: translateY(0); opacity: 1;}
        }
      `}</style>
    </>
  );
};

export default UserChatPopup;
