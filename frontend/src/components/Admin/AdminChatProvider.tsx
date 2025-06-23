import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const AdminChatContext = createContext<any>(null);

export const useAdminChat = () => useContext(AdminChatContext);

export const AdminChatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unreadCount, setUnreadCount] = useState<Record<string, number>>({});
  const stompClientRef = useRef<Client | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState<string | null>(null);
  // Ref để callback luôn đọc được giá trị mới nhất
  const currentChatUserRef = useRef<string | null>(null);

  useEffect(() => {
    currentChatUserRef.current = currentChatUser;
  }, [currentChatUser]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe("/user/admin/private", (msg: IMessage) => {
          const raw = JSON.parse(msg.body);
          const sender = raw.senderName;
          // Đọc từ ref, luôn đúng nhất
          if (sender !== "admin" && currentChatUserRef.current !== sender) {
            setUnreadCount((prev) => ({
              ...prev,
              [sender]: (prev[sender] || 0) + 1,
            }));
          }
        });
      },
    });
    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const resetUnread = (user: string) => {
    setUnreadCount((prev) => ({
      ...prev,
      [user]: 0,
    }));
  };

  const setActiveChatUser = (user: string | null) => {
    setCurrentChatUser(user);
    currentChatUserRef.current = user; // cập nhật ref luôn
  };

  return (
    <AdminChatContext.Provider
      value={{ unreadCount, resetUnread, setActiveChatUser }}
    >
      {children}
    </AdminChatContext.Provider>
  );
};

// Khắc phục lỗi TS1208:
export {};