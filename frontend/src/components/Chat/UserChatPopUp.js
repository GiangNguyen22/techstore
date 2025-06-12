import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./UserChatPopup.css";

const UserChatPopup = ({ authToken, username }) => {
  const chatBodyRef = React.useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!authToken || !username) return; // đợi token có

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/chat/history/admin/${username}`,
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

        const normalized = data.map((msg) => ({
          ...msg,
          senderName: msg.sender,
          receiverName: msg.receiver,
        }));

        setMessages(normalized);
      } catch (err) {
        console.error("Lỗi lấy lịch sử chat:", err.message);
      }
    };

    fetchHistory(); // gọi API lịch sử

    // Khởi tạo kết nối websocket
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/user/${username}/private`, (msg) => {
          const payload = JSON.parse(msg.body);
          setMessages((prev) => [...prev, payload]);

          if (!open) {
            setUnreadCount((prev) => prev + 1); // tăng badge nếu chat đang đóng
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
    };
  }, [authToken, username, open]); // thêm `authToken` vào dependency để chạy lại khi token có

  const sendMessage = () => {
    if (message.trim() !== "" && stompClient) {
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
    }
  };

  useEffect(() => {
  scrollToBottom();
}, [messages, open]); // khi có tin nhắn mới hoặc mở lại khung chat


  const scrollToBottom = () => {
  if (chatBodyRef.current) {
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }
};


  return (
    <>
      <div
        id="chat-icon"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnreadCount(0); // reset khi mở khung chat
        }}
      >
        💬
        {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
      </div>

      {open && (
        <div className="chat-popup">
          <div className="chat-header">Support Chat</div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.senderName === username ? "me" : "admin"
                  }`}
              >
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserChatPopup;
