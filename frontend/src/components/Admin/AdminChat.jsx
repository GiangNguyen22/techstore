import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const AdminChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
   const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe('/user/admin/private', onMessageReceived);
      },
      onStompError: (error) => {
        console.error('STOMP error:', error);
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

 useEffect(() => {
 
  if (!token) return;

  fetch('http://localhost:8080/api/chat/users-chatted-with-admin', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(async res => {
      if (!res.ok || res.status === 204) return [];
      return res.json();
    })
    .then(data => {
      setClients(data || []);
    })
    .catch(err => {
      console.error("Lỗi khi tải danh sách user đã chat:", err);
    });
}, []);


useEffect(() => {
 
  if (!token || !selectedClient) return;

  fetch(`http://localhost:8080/api/chat/history/admin/${selectedClient}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(async res => {
      if (!res.ok || res.status === 204) return [];
      return res.json();
    })
    .then(data => {
      const normalized = data.map(msg => ({
        ...msg,
        senderName: msg.sender,
        receiverName: msg.receiver,
      }));

      setMessages(prev => ({ ...prev, [selectedClient]: normalized }));
    })
    .catch(err => {
      console.error("Lỗi khi tải lịch sử tin nhắn:", err);
    });
}, [selectedClient]);





 const onMessageReceived = (msg) => {
  const payload = JSON.parse(msg.body);
  const { senderName, receiverName } = payload;

  // 👇 Xác định người mà admin đang chat cùng
  const chatPartner = senderName === 'admin' ? receiverName : senderName;

  // Cập nhật danh sách tin nhắn
  setMessages(prev => {
    const conv = prev[chatPartner] || [];
    return { ...prev, [chatPartner]: [...conv, payload] };
  });

  // Thêm vào danh sách clients nếu chưa có
  setClients(prev => {
    if (!prev.includes(chatPartner)) return [...prev, chatPartner];
    return prev;
  });
};


  const sendMessage = () => {
    if (stompClient && selectedClient && message.trim()) {
      const msg = {
        senderName: 'admin',
        receiverName: selectedClient,
        message,
      };

      stompClient.publish({
        destination: '/app/private-message',
        body: JSON.stringify(msg),
      });

      setMessage('');
    }
  };

  return (
  <div style={{ fontFamily: 'sans-serif', height: '100vh' }}>
    {!showChat ? (
      <div style={{ padding: '20px' }}>
        <button
          onClick={() => setShowChat(true)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          📨 Message
        </button>
      </div>
    ) : (
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Sidebar bên trái */}
        <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Users</h3>
            <button
              onClick={() => {
                setShowChat(false);
                setSelectedClient(null);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Exit
            </button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
            {clients.map((client, i) => (
              <li
                key={i}
                onClick={() => setSelectedClient(client)}
                style={{
                  padding: '10px',
                  background: client === selectedClient ? '#007bff' : '#f1f1f1',
                  color: client === selectedClient ? '#fff' : '#000',
                  marginBottom: '5px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {client}
              </li>
            ))}
          </ul>
        </div>

        {/* Khung chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#f9f9f9' }}>
            <strong>Chat with: </strong> {selectedClient || 'No one selected'}
          </div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#fafafa' }}>
            {selectedClient && (messages[selectedClient] || []).map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.senderName === 'admin' ? 'right' : 'left',
                  margin: '5px 0'
                }}
              >
                <span style={{
                  background: msg.senderName === 'admin' ? '#dcf8c6' : '#eee',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  maxWidth: '70%'
                }}>
                  {msg.message}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex' }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              style={{ flex: 1, padding: '8px', marginRight: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button
              onClick={sendMessage}
              style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default AdminChat;
