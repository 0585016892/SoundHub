import React, { useState } from "react";
import { Button, Badge, Card } from "react-bootstrap";
import CustomerChat from "../components/CustomerChat";
import { BsChatDotsFill, BsX, BsHeadset } from "react-icons/bs";
import { useUser } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const [showChat, setShowChat] = useState(false);
  const [unread, setUnread] = useState(0);
  const { user } = useUser();

  return (
    <>
      {/* NÚT CHAT NỔI VỚI HIỆU ỨNG GLOW */}
      <motion.div
        className="position-fixed"
        style={{ bottom: 30, right: 30, zIndex: 1100 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          className="chat-toggle-btn d-flex justify-content-center align-items-center shadow-lg"
          onClick={() => {
            setShowChat((prev) => !prev);
            setUnread(0);
          }}
        >
          <AnimatePresence mode="wait">
            {showChat ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <BsX size={35} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <BsChatDotsFill size={28} />
              </motion.div>
            )}
          </AnimatePresence>

          {unread > 0 && !showChat && (
            <Badge pill bg="danger" className="unread-badge">
              {unread}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* CỬA SỔ CHAT LUXURY */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="position-fixed luxury-chat-window"
          >
            <Card className="chat-card-glass border-0 overflow-hidden shadow-2xl">
              {/* CHAT HEADER */}
              <div className="chat-header-luxury p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-support">
                    <BsHeadset size={20} />
                    <span className="status-online"></span>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">SOUNDHUB SUPPORT</h6>
                    <small className="text-white-50">Sẵn sàng hỗ trợ bạn 24/7</small>
                  </div>
                </div>
                <div className="header-actions">
                  <span className="dot-pulse"></span>
                </div>
              </div>

              {/* BODY CHAT */}
              <div className="chat-content-area">
                <CustomerChat userId={user?.id} />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Nút Chat Neon */
        .chat-toggle-btn {
          width: 65px;
          height: 65px;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #ff6600 0%, #ff3300 100%) !important;
          border: none !important;
          color: white !important;
          box-shadow: 0 10px 25px rgba(255, 102, 0, 0.4) !important;
          position: relative;
        }
        
        .chat-toggle-btn:after {
          content: '';
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          background: #ff6600;
          z-index: -1;
          animation: chat-ping 2s infinite;
        }

        @keyframes chat-ping {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .unread-badge {
          position: absolute;
          top: -5px; right: -5px;
          padding: 6px 10px !important;
          border: 2px solid #050505;
          font-size: 10px;
        }

        /* Cửa sổ chat */
        .luxury-chat-window {
          bottom: 110px;
          right: 30px;
          width: 380px;
          height: 550px;
          z-index: 1050;
        }

        .chat-card-glass {
          background: rgba(15, 15, 15, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chat-header-luxury {
          background: rgba(255, 102, 0, 0.1);
          border-bottom: 1px solid rgba(255, 102, 0, 0.2);
        }

        .avatar-support {
          width: 40px;
          height: 40px;
          background: #ff6600;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          position: relative;
        }

        .status-online {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #00ff00;
          border: 2px solid #0f0f0f;
          border-radius: 50%;
        }

        .chat-content-area {
          flex: 1;
          overflow: hidden;
          background: transparent;
        }

        /* Dot Pulse */
        .dot-pulse {
          display: inline-block;
          width: 8px; height: 8px;
          background: #ff6600;
          border-radius: 50%;
          box-shadow: 0 0 10px #ff6600;
          animation: pulse-op 1.5s infinite;
        }

        @keyframes pulse-op {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (max-width: 576px) {
          .luxury-chat-window {
            width: calc(100vw - 40px);
            height: 70vh;
            right: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatPage;