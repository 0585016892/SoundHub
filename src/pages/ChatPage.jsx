import React, { useState } from "react";
import { Button, Badge, Card } from "react-bootstrap";
import CustomerChat from "../components/CustomerChat";
import { BsChatDotsFill, BsX } from "react-icons/bs";
import { useUser } from "../context/UserContext";

const ChatPage = () => {
  const [showChat, setShowChat] = useState(false);
  const [unread, setUnread] = useState(0);
  const { user } = useUser();

  // Gọi khi nhận tin nhắn mới từ admin
  const handleNewMessage = () => setUnread(prev => prev + 1);

  return (
    <>
      {/* Nút chat nổi */}
      <Button
        variant="primary"
        className="position-fixed d-flex justify-content-center align-items-center"
        style={{ bottom: 20, right: 20, borderRadius: "50%", width: 60, height: 60, padding: 0, zIndex: 1100 }}
        onClick={() => {
          setShowChat(prev => !prev);
          setUnread(0); // mở chat => đánh dấu đã đọc
        }}
      >
        <BsChatDotsFill size={30} />
        {unread > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute"
            style={{ top: 0, right: 0 }}
          >
            {unread}
          </Badge>
        )}
      </Button>

      {/* Cửa sổ chat */}
      {showChat && (
        <Card
          className="position-fixed"
          style={{ bottom: 90, right: 20, width: 350, height: 500, zIndex: 1000 }}
        >

          {/* Body chat */}
          <div style={{ flex: 1, height: "100%" }}>
            <CustomerChat userId={user?.id} />
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatPage;
