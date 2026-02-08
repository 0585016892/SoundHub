import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Form, Button, Image } from "react-bootstrap";
import socket from "../utils/socket";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaSmile } from "react-icons/fa";

const CustomerChat = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Load lịch sử chat
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:20032/api/chat/history/${user.id}`)
      .then(res => res.json())
      .then(data => {
        // Chuẩn hóa dữ liệu từ DB (mapping sender thành 'admin'/'user')
        const history = data.map(m => ({
          from: m.isAdminSender ? "admin" : "user",
          text: m.message,
          time: m.createdAt
        }));
        setMessages(history || []);
      })
      .catch(() => setMessages([]));
  }, [user]);

  // Socket.io
  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
      socket.emit("join", { userId: user.id, isAdmin: false });
    }

    const onReceive = ({ fromUserId, message, isAdminSender }) => {
      if (isAdminSender) {
        setMessages(prev => [...prev, { from: "admin", text: message, time: new Date() }]);
      }
    };

    socket.on("receiveMessage", onReceive);
    return () => socket.off("receiveMessage", onReceive);
  }, [user]);

  const handleSend = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      toUserId: "admin",
      fromUserId: user.id,
      message: input,
      isAdminSender: false,
    });
    setMessages(prev => [...prev, { from: "user", text: input, time: new Date() }]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  return (
    <div className="inner-chat-container">
      {/* KHÔNG GIAN TIN NHẮN */}
      <div className="chat-messages-scroll">
        {messages.length > 0 ? (
          messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: m.from === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`message-wrapper ${m.from === "user" ? "is-user" : "is-admin"}`}
            >
              <div className="message-bubble">
                {m.text}
                <span className="message-time">
                  {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-chat-state">
            <div className="welcome-art">🎧</div>
            <h5>SoundHub xin chào!</h5>
            <p>Chúng tôi có thể giúp gì cho trải nghiệm âm nhạc của bạn?</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* KHU VỰC NHẬP LIỆU */}
      <div className="chat-input-wrapper">
        <InputGroup className="glass-input-group">
          <Button className="emoji-btn"><FaSmile /></Button>
          <Form.Control
            placeholder="Viết tin nhắn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="chat-input-field"
          />
          <Button onClick={handleSend} className="chat-send-btn">
            <FaPaperPlane />
          </Button>
        </InputGroup>
      </div>

      <style>{`
        .inner-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: transparent;
        }

        /* Messages Area */
        .chat-messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Tùy chỉnh thanh cuộn */
        .chat-messages-scroll::-webkit-scrollbar { width: 4px; }
        .chat-messages-scroll::-webkit-scrollbar-thumb { background: rgba(255,102,0,0.2); border-radius: 10px; }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 85%;
        }

        .message-bubble {
          padding: 10px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          color: #fff;
        }

        .message-time {
          display: block;
          font-size: 9px;
          margin-top: 4px;
          opacity: 0.5;
          text-transform: uppercase;
        }

        /* Style cho User (Bạn) */
        .is-user { align-self: flex-end; }
        .is-user .message-bubble {
          background: linear-gradient(135deg, #ff6600, #ff3300);
          border-bottom-right-radius: 2px;
          box-shadow: 0 4px 15px rgba(255,102,0,0.2);
        }
        .is-user .message-time { text-align: right; }

        /* Style cho Admin */
        .is-admin { align-self: flex-start; }
        .is-admin .message-bubble {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.05);
          border-bottom-left-radius: 2px;
        }

        /* Trạng thái trống */
        .empty-chat-state {
          text-align: center; margin: auto; color: #666;
        }
        .welcome-art { font-size: 40px; margin-bottom: 15px; }
        .empty-chat-state h5 { color: #fff; font-weight: 800; }

        /* Input area */
        .chat-input-wrapper {
          padding: 15px;
          background: rgba(0,0,0,0.2);
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .glass-input-group {
          background: rgba(255,255,255,0.05);
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px;
          display: flex;
          align-items: center;
        }

        .chat-input-field {
          background: transparent !important;
          border: none !important;
          color: #fff !important;
          box-shadow: none !important;
          font-size: 14px;
        }

        .chat-input-field::placeholder { color: #555; }

        .emoji-btn, .chat-send-btn {
          background: transparent !important;
          border: none !important;
          color: #666 !important;
          transition: 0.3s;
        }

        .chat-send-btn { color: #ff6600 !important; font-size: 18px; }
        .chat-send-btn:hover { transform: scale(1.1); color: #fff !important; }
        .emoji-btn:hover { color: #fff !important; }
      `}</style>
    </div>
  );
};

export default CustomerChat;