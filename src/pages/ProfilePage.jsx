import React, { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Row,
  Col,
  Spin,
  Button,
  Avatar,
  message,
  Tag,
} from "antd";
import { motion } from "framer-motion";
import { getUserOrders, updateOrderStatus } from "../api/userApi"; // Giả định các API của bạn
import { useUser } from "../context/UserContext";
import { connectOrderSocket } from "../utils/orderSocket";
import Logo from "../assets/logo2.png";

import {
  UserOutlined,
  ShoppingOutlined,
  LockOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";

const ProfilePage = () => {
  const IMAGE_URL = `${process.env.REACT_APP_WEB_URL}/uploads/products/`;
  const { user } = useUser();

  const [key, setKey] = useState("info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [updateInfo, setUpdateInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Theo dõi kích thước màn hình để thay đổi hướng Tabs
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    setUpdateInfo({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    loadOrders();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = connectOrderSocket(user.id);
    const handleOrderUpdate = async ({ orderId, order_status }) => {
      message.info(`Đơn hàng DH${orderId} đã cập nhật: ${order_status}`);
      loadOrders();
    };
    socket.on("orderStatusUpdated", handleOrderUpdate);
    return () => socket.off("orderStatusUpdated", handleOrderUpdate);
  }, [user]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getUserOrders(user.id);
      setOrders(res.data || []);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusTag = (status) => {
    const config = {
      pending: {
        color: "gold",
        icon: <ClockCircleOutlined />,
        text: "Chờ xử lý",
      },
      shipping: { color: "blue", icon: <TruckOutlined />, text: "Đang giao" },
      completed: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
      },
      cancelled: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
      },
    };
    const s = config[status] || config.pending;
    return (
      <Tag icon={s.icon} color={s.color} className="status-tag m-0">
        {s.text.toUpperCase()}
      </Tag>
    );
  };
  // viết hàm hủy ở đây
  const huyDonHang = (orderId) => {
    try {
      updateOrderStatus(orderId, { order_status: "cancelled" });
      message.success("Đã hủy đơn hàng");
      loadOrders();
    } catch {
      message.error("Hủy thất bại");
    }
  };

  return (
    <div className="profile-wrapper py-3 py-md-5 mt-5">
      <div className="container">
        {/* USER HEADER CARD */}
        <motion.div
          className="user-hero-card mb-4 mb-md-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 p-4 text-center text-md-start">
            <div className="avatar-wrapper">
              <Avatar size={isMobile ? 80 : 100} src={Logo} />
              <div className="online-indicator"></div>
            </div>
            <div>
              <h2 className="text-white fw-black mb-1 fs-3">
                {user?.name?.toUpperCase()}
              </h2>
              <p className="text-secondary mb-0 small">
                <MailOutlined className="me-2" />
                {user?.email}
              </p>
              <Tag color="#ff6600" className="mt-2">
                Khách hàng thành viên
              </Tag>
            </div>
          </div>
        </motion.div>

        <div className="profile-content-grid">
          <Tabs
            activeKey={key}
            onChange={setKey}
            className="custom-profile-tabs"
            tabPosition={isMobile ? "top" : "left"}
          >
            {/* TAB: THÔNG TIN */}
            <Tabs.TabPane
              tab={
                <span>
                  <UserOutlined /> {!isMobile && "TÀI KHOẢN"}
                </span>
              }
              key="info"
            >
              <div className="glass-panel p-3 p-md-4">
                <h4 className="panel-title">THÔNG TIN CÁ NHÂN</h4>
                <Form layout="vertical" className="dark-form">
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item label="HỌ VÀ TÊN">
                        <Input
                          value={updateInfo.name}
                          onChange={(e) =>
                            setUpdateInfo({
                              ...updateInfo,
                              name: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="SỐ ĐIỆN THOẠI">
                        <Input
                          value={updateInfo.phone}
                          onChange={(e) =>
                            setUpdateInfo({
                              ...updateInfo,
                              phone: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="ĐỊA CHỈ GIAO HÀNG">
                    <Input.TextArea
                      rows={3}
                      value={updateInfo.address}
                      onChange={(e) =>
                        setUpdateInfo({
                          ...updateInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                  <Button
                    className="btn-accent w-100-mobile"
                    onClick={() => message.success("Đã cập nhật!")}
                  >
                    LƯU THAY ĐỔI
                  </Button>
                </Form>
              </div>
            </Tabs.TabPane>

            {/* TAB: ĐƠN HÀNG */}
            <Tabs.TabPane
              tab={
                <span>
                  <ShoppingOutlined /> {!isMobile && "ĐƠN HÀNG"}
                </span>
              }
              key="orders"
            >
              <div className="glass-panel p-3 p-md-4">
                <h4 className="panel-title">LỊCH SỬ MUA SẮM</h4>
                {loadingOrders ? (
                  <div className="text-center py-5">
                    <Spin />
                  </div>
                ) : (
                  <div className="order-list-scroll">
                    {orders.map((o) => (
                      <div key={o.id} className="order-item-card mb-3">
                        <div className="order-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                          <span className="order-id">#DH{o.id}</span>
                          {getStatusTag(o.order_status)}
                          {o.order_status === "pending" && (
                            // Cho phép hủy đơn nếu đang ở trạng thái "pending"
                            <Button
                              size="small"
                              danger
                              onClick={() => huyDonHang(o.id)}
                            >
                              Hủy
                            </Button>
                          )}
                        </div>
                        {o.items.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex gap-2 gap-md-3 mb-3 item-row"
                          >
                            <img
                              src={IMAGE_URL + item.image}
                              className="order-img"
                              alt=""
                            />
                            <div className="flex-grow-1 min-width-0">
                              <div className="text-white fw-bold text-truncate">
                                {item.product_name}
                              </div>
                              <div className="text-secondary small">
                                x{item.quantity} -{" "}
                                {Number(item.price).toLocaleString()}đ
                              </div>
                            </div>
                            <div className="text-white fw-bold d-none d-md-block">
                              {Number(item.total).toLocaleString()}đ
                            </div>
                          </div>
                        ))}
                        <div className="order-footer pt-3 mt-2 border-top border-secondary d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                          <div className="shipping-info">
                            <div className="small text-secondary text-truncate">
                              <PhoneOutlined className="me-1" /> {o.phone}
                            </div>
                            <div className="small text-secondary text-truncate">
                              <EnvironmentOutlined className="me-1" />{" "}
                              {o.address}
                            </div>
                          </div>
                          <div className="text-md-end border-top border-secondary pt-2 border-md-top-0">
                            <div className="small text-secondary">
                              TỔNG THANH TOÁN
                            </div>
                            <div className="total-price">
                              {Number(o.final_amount).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Tabs.TabPane>

            {/* TAB: BẢO MẬT */}
            <Tabs.TabPane
              tab={
                <span>
                  <LockOutlined /> {!isMobile && "BẢO MẬT"}
                </span>
              }
              key="password"
            >
              <div className="glass-panel p-3 p-md-4">
                <h4 className="panel-title">ĐỔI MẬT KHẨU</h4>
                <Form layout="vertical" className="dark-form">
                  <Form.Item label="MẬT KHẨU HIỆN TẠI">
                    <Input.Password placeholder="••••••••" />
                  </Form.Item>
                  <Form.Item label="MẬT KHẨU MỚI">
                    <Input.Password placeholder="••••••••" />
                  </Form.Item>
                  <Button className="btn-accent-outline w-100-mobile">
                    CẬP NHẬT
                  </Button>
                </Form>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      <style>{`
        .profile-wrapper { background: #050505; min-height: 100vh; color: #fff; }
        .fw-black { font-weight: 900; }
        .user-hero-card { 
          background: linear-gradient(135deg, #111 0%, #050505 100%);
          border: 1px solid #1a1a1a;
          border-radius: 20px;
        }
        .avatar-wrapper { position: relative; display: inline-block; }
        .online-indicator {
          position: absolute; bottom: 5px; right: 5px; width: 14px; height: 14px;
          background: #52c41a; border: 2px solid #111; border-radius: 50%;
        }

        /* Responsive Tabs */
        .custom-profile-tabs .ant-tabs-nav { background: #0a0a0a; border-radius: 15px; padding: 8px; border: 1px solid #1a1a1a; margin-bottom: 20px !important; }
        .custom-profile-tabs .ant-tabs-tab { color: #888 !important; margin: 4px 0 !important; transition: 0.3s; padding: 10px 15px !important; justify-content: center; }
        .custom-profile-tabs .ant-tabs-tab-active { background: #ff6600 !important; border-radius: 8px !important; }
        .custom-profile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #fff !important; font-weight: 800; }
        .custom-profile-tabs .ant-tabs-ink-bar { display: none; }

        /* Panels */
        .glass-panel { background: #0a0a0a; border-radius: 20px; border: 1px solid #1a1a1a; min-height: 400px; }
        .panel-title { color: #ff6600; font-weight: 900; letter-spacing: 1px; margin-bottom: 20px; font-size: 1.1rem; }

        /* Forms */
        .dark-form .ant-form-item-label label { color: #666 !important; font-weight: 800; font-size: 10px; }
        .dark-form .ant-input, .dark-form .ant-input-password, .dark-form .ant-input-affix-wrapper {
          background: #111 !important; border: 1px solid #222 !important; color: #fff !important; padding: 8px 12px;
        }

        /* Order Cards */
        .order-item-card { background: #111; border-radius: 12px; padding: 15px; border: 1px solid #222; }
        .order-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
        .total-price { color: #ff6600; font-weight: 900; font-size: 1.2rem; }
        .order-list-scroll { max-height: 550px; overflow-y: auto; }

        /* Mobile Utility */
        @media (max-width: 767.98px) {
          .w-100-mobile { width: 100%; }
          .custom-profile-tabs .ant-tabs-nav { margin: 0 0 15px 0 !important; }
          .order-id { font-size: 0.9rem; }
          .min-width-0 { min-width: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
