// src/components/Admin/AdminChatBox.tsx
import React, { RefObject } from "react";

interface AdminChatBoxProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  clients: string[];
  selectedClient: string | null;
  setSelectedClient: (client: string | null) => void;
  unreadCount: Record<string, number>;
  handleSelectClient: (client: string) => void;
  isLoadingHistory: boolean;
  messages: Record<string, { senderName: string; receiverName: string; message: string; date?: string }[]>;
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  chatBodyRef: RefObject<HTMLDivElement>;
}

const AdminChatBox: React.FC<AdminChatBoxProps> = ({
  showChat,
  setShowChat,
  clients,
  selectedClient,
  setSelectedClient,
  unreadCount,
  handleSelectClient,
  isLoadingHistory,
  messages,
  message,
  setMessage,
  sendMessage,
  chatBodyRef,
}) => {
  if (!showChat) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="fixed top-1/2 right-5 -translate-y-1/2 bg-blue-600 text-white text-xl px-6 py-4 rounded-lg shadow-lg z-50 hover:bg-blue-700 transition"
      >
        📨 Message
      </button>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: 250, borderRight: "1px solid #ddd", padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Users</h3>
          <button
            onClick={() => {
              setShowChat(false);
              setSelectedClient(null);
            }}
            style={{
              padding: "4px 8px",
              fontSize: 12,
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        </div>
        <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
          {clients.map((client, i) => (
            <li
              key={i}
              onClick={() => handleSelectClient(client)}
              style={{
                padding: 10,
                background: client === selectedClient ? "#007bff" : "#f1f1f1",
                color: client === selectedClient ? "#fff" : "#000",
                marginBottom: 5,
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{client}</span>
                {unreadCount[client] > 0 && (
                  <span
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      fontSize: 12,
                      borderRadius: "50%",
                      padding: "2px 8px",
                    }}
                  >
                    {unreadCount[client]}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: 10,
            borderBottom: "1px solid #ddd",
            background: "#f9f9f9",
          }}
        >
          <strong>Chat with: </strong> {selectedClient || "No one selected"}
        </div>

        <div
          ref={chatBodyRef}
          style={{
            flex: 1,
            padding: 10,
            overflowY: "auto",
            background: "#fafafa",
          }}
        >
          {isLoadingHistory ? (
            <p>Đang tải lịch sử chat...</p>
          ) : (
            selectedClient &&
            (messages[selectedClient] || []).map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.senderName === "admin" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <div style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>
                  {msg.senderName} ➡ {msg.receiverName} |{" "}
                  {msg.date ? new Date(msg.date).toLocaleTimeString() : ""}
                </div>
                <span
                  style={{
                    background: msg.senderName === "admin" ? "#dcf8c6" : "#eee",
                    padding: "6px 12px",
                    borderRadius: 12,
                    display: "inline-block",
                    maxWidth: "70%",
                  }}
                >
                  {msg.message}
                </span>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            padding: 10,
            borderTop: "1px solid #ddd",
            display: "flex",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            style={{
              flex: 1,
              padding: 8,
              marginRight: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatBox;
