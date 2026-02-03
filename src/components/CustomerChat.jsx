import React, { useState, useEffect, useRef } from "react";
import { Card, InputGroup, Form, Button, Badge, Image } from "react-bootstrap";
import socket from "../utils/socket";
import { useUser } from "../context/UserContext";

const CustomerChat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminOnline, setAdminOnline] = useState(false);
  const messagesEndRef = useRef(null);

  // Load lịch sử chat khi mount
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:20032/api/chat/history/${user.id}`)
      .then(res => res.json())
      .then(data => setMessages(data || []))
      .catch(() => setMessages([]));
  }, [user]);

  // Socket.io
useEffect(() => {
  if (!user) return;

  if (!socket.connected) {
    socket.connect();
    socket.emit("join", {
      userId: user.id,
      isAdmin: false,
    });
  }

  const onReceive = ({ fromUserId, message, isAdminSender }) => {
    if (isAdminSender) {
      setMessages(prev => [...prev, { from: "admin", text: message }]);
    }
  };

  socket.on("receiveMessage", onReceive);

  return () => {
    socket.off("receiveMessage", onReceive);
    // ❌ KHÔNG disconnect ở đây
  };
}, [user]);


  const handleSend = () => {
    if (!input) return;
    socket.emit("sendMessage", {
      toUserId: "admin",
      fromUserId: user.id,
      message: input,
      isAdminSender: false,
    });
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  return (
    <Card
      style={{
        width: "360px",
        height: "520px",
        position: "fixed",
        bottom: "90px",
        right: "20px",
        zIndex: 999,
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Card.Header
        className="d-flex align-items-center justify-content-between"
        style={{ backgroundColor: "#349bc9", color: "#fff", fontWeight: "bold" }}
      >
        <div className="d-flex align-items-center">
          Hỗ trợ khách hàng
        </div>
        {adminOnline ? (
          <Badge bg="success">Online</Badge>
        ) : (
          <Badge bg="secondary">Offline</Badge>
        )}
      </Card.Header>

      {/* Chat body */}
      <div
        className="flex-grow-1 p-3"
        style={{ overflowY: "auto", backgroundColor: "#f4f6f8" }}
      >
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <div
              key={i}
              className={`d-flex mb-2 justify-content-${m.from === "user" ? "end" : "start"}`}
            >
              {m.from === "admin" && (
                <Image
                  src="https://img.icons8.com/color/48/admin-settings-male.png"
                  roundedCircle
                  style={{ width: 28, height: 28, marginRight: 8 }}
                />
              )}
              <div
                className={`p-2 rounded shadow-sm`}
                style={{
                  maxWidth: "70%",
                  backgroundColor: m.from === "user" ? "#349bc9" : "#e9ecef",
                  color: m.from === "user" ? "#fff" : "#000",
                  borderRadius:
                    m.from === "user"
                      ? "15px 15px 0 15px"
                      : "15px 15px 15px 0",
                }}
              >
                {m.text}
              </div>
              {m.from === "user" && (
                <Image
                  src="https://img.icons8.com/ios-filled/50/user-male-circle.png"
                  roundedCircle
                  style={{ width: 28, height: 28, marginLeft: 8 }}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-3">Chưa có tin nhắn</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputGroup className="p-2 border-top">
        <Form.Control
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={e => setInput(e.target.value)}
         onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}

          style={{ borderRadius: "20px" }}
        />
        <Button
          variant="primary"
          onClick={handleSend}
          style={{ borderRadius: "20px", marginLeft: "5px" }}
        >
          Gửi
        </Button>
      </InputGroup>
    </Card>
  );
};

export default CustomerChat;
