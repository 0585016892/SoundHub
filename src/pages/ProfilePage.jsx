import React, { useState, useEffect, useMemo } from "react";
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
  Space,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { getUserOrders, updateOrderStatus } from "../api/userApi";
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
  FileTextOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
  RightOutlined,
  CalendarOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs"; // Nên dùng dayjs để format thời gian
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

  // Tính tổng tiền từ các đơn hàng đã hoàn thành (Dùng useMemo để tối ưu)
  const totalSpent = useMemo(() => {
    return orders
      .filter((order) => order.order_status === "completed")
      .reduce((sum, order) => sum + Number(order.final_amount || 0), 0);
  }, [orders]);

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
        color: "#FF5302",
        icon: <ClockCircleOutlined />,
        text: "Chờ xử lý",
      },
      shipping: {
        color: "#3b82f6",
        icon: <TruckOutlined />,
        text: "Đang giao",
      },
      completed: {
        color: "#22c55e",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
      },
      cancelled: {
        color: "#ef4444",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
      },
    };
    const s = config[status] || config.pending;
    return (
      <Tag color={s.color} bordered={false} className="status-tag-custom">
        {s.text.toUpperCase()}
      </Tag>
    );
  };

  const huyDonHang = (orderId) => {
    try {
      updateOrderStatus(orderId, { order_status: "cancelled" });
      message.success("Đã lệnh hủy đơn hàng");
      setTimeout(() => {
        setLoadingOrders(true);
        loadOrders();
      }, 1000);
    } catch {
      message.error("Lỗi kết nối hệ thống");
    }
  };
  console.log(orders);

  return (
    <div className="neo-bento-wrapper">
      <div className="container py-4 py-md-5">
        <Row gutter={[24, 24]}>
          {/* CỘT TRÁI: THÔNG TIN TÓM TẮT */}
          <Col xs={24} lg={8} xl={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card user-profile-card"
            >
              <div className="avatar-section">
                <div className="avatar-ring">
                  <Avatar size={100} src={Logo} />
                  <div className="online-badge" />
                </div>
                <h2 className="display-name">
                  {user?.name?.toUpperCase() || "KHÁCH HÀNG"}
                </h2>
                <p className="display-email">{user?.email}</p>
                <Tag color="gold" className="rank-tag">
                  THÀNH VIÊN VIP
                </Tag>
              </div>

              <div className="side-nav mt-4">
                <div
                  className={`nav-item ${key === "info" ? "active" : ""}`}
                  onClick={() => setKey("info")}
                >
                  <UserOutlined /> <span>Thông tin cá nhân</span>
                  <RightOutlined className="arrow" />
                </div>
                <div
                  className={`nav-item ${key === "orders" ? "active" : ""}`}
                  onClick={() => setKey("orders")}
                >
                  <ShoppingOutlined /> <span>Lịch sử đơn hàng</span>
                  <RightOutlined className="arrow" />
                </div>
                <div
                  className={`nav-item ${key === "password" ? "active" : ""}`}
                  onClick={() => setKey("password")}
                >
                  <LockOutlined /> <span>Bảo mật & Mật khẩu</span>
                  <RightOutlined className="arrow" />
                </div>
              </div>
            </motion.div>
          </Col>

          {/* CỘT PHẢI: CHI TIẾT */}
          <Col xs={24} lg={16} xl={17}>
            <AnimatePresence mode="wait">
              {key === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bento-card main-content"
                >
                  <h4 className="panel-title mb-4">THÔNG TIN TÀI KHOẢN</h4>
                  <Form layout="vertical" className="neo-form">
                    <Row gutter={20}>
                      <Col xs={24} md={12}>
                        <Form.Item label="HỌ VÀ TÊN">
                          <Input
                            size="large"
                            prefix={<UserOutlined />}
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
                            size="large"
                            prefix={<PhoneOutlined />}
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
                        rows={4}
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
                      type="primary"
                      size="large"
                      icon={<SaveOutlined />}
                      className="btn-neo-primary"
                      onClick={() => message.success("Đã đồng bộ thông tin!")}
                    >
                      LƯU THAY ĐỔI
                    </Button>
                  </Form>
                </motion.div>
              )}

              {key === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bento-card main-content"
                >
                  <h4 className="panel-title mb-4">LỊCH SỬ MUA SẮM</h4>

                  {/* PHẦN THỐNG KÊ (DATA VISUALIZATION) */}
                  <div className="stats-dashboard-grid mb-4">
                    <div className="stats-card">
                      <div className="stats-icon-wrapper order-bg">
                        <ShoppingOutlined />
                      </div>
                      <div className="stats-info">
                        <span className="stats-label">TỔNG ĐƠN HÀNG</span>
                        <div className="stats-value-group">
                          <span className="stats-number">{orders.length}</span>
                          <span className="stats-unit">Kiện</span>
                        </div>
                      </div>
                      <div className="stats-decorator pulse-blue"></div>
                    </div>

                    <div className="stats-card">
                      <div className="stats-icon-wrapper money-bg">
                        <SafetyCertificateOutlined />
                      </div>
                      <div className="stats-info">
                        <span className="stats-label">TỔNG TÍCH LŨY</span>
                        <div className="stats-value-group">
                          <span className="stats-number highlight">
                            {totalSpent.toLocaleString()}
                          </span>
                          <span className="stats-unit">VNĐ</span>
                        </div>
                      </div>
                      <div className="stats-decorator pulse-gold"></div>
                    </div>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-5">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div
                      className="order-scroll-container"
                      style={{ maxHeight: "500px", overflowY: "auto" }}
                    >
                      {orders.length === 0 ? (
                        <p className="text-muted">Chưa có dữ liệu đơn hàng.</p>
                      ) : (
                        orders.map((o) => (
                          <div key={o.id} className="order-neo-item">
                            {/* Header: ID & Trạng thái */}
                            <div className="order-neo-header">
                              <div className="d-flex flex-column">
                                <span className="order-id">
                                  MÃ ĐƠN: <strong>#DH{o.id}</strong>
                                </span>
                                <span className="order-date">
                                  <CalendarOutlined />{" "}
                                  {dayjs(o.created_at).format(
                                    "DD/MM/YYYY HH:mm",
                                  )}
                                </span>
                              </div>
                              {getStatusTag(o.order_status)}
                              {o.order_status === "pending" && (
                                <Button
                                  danger
                                  onClick={() => huyDonHang(o.id)}
                                  className="btn-cancel"
                                >
                                  HỦY ĐƠN
                                </Button>
                              )}
                            </div>

                            {/* Body: Danh sách sản phẩm */}
                            <div className="order-neo-body">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="product-mini-row">
                                  <img
                                    src={IMAGE_URL + item.image}
                                    alt=""
                                    className="mini-img"
                                  />
                                  <div className="flex-grow-1">
                                    <div className="product-name">
                                      {item.product_name}
                                    </div>
                                    <div className="product-meta">
                                      Số lượng: {item.quantity} | Đơn giá:{" "}
                                      {Number(item.price).toLocaleString()}đ
                                    </div>
                                  </div>
                                  <div className="product-total">
                                    {Number(item.total).toLocaleString()}đ
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Info: Thông tin khách hàng & Note */}
                            <div className="order-neo-info-panel">
                              <Row gutter={[16, 8]}>
                                <Col span={12}>
                                  <div className="info-item">
                                    <UserOutlined /> <span>{o.full_name}</span>
                                  </div>
                                  <div className="info-item">
                                    <PhoneOutlined /> <span>{o.phone}</span>
                                  </div>
                                </Col>
                                <Col span={12}>
                                  <div className="info-item">
                                    <WalletOutlined />{" "}
                                    <span>
                                      PTTT: {o.payment_method.toUpperCase()}
                                    </span>
                                  </div>
                                  {o.note && (
                                    <div className="info-item">
                                      <FileTextOutlined />{" "}
                                      <span>Lưu ý: {o.note}</span>
                                    </div>
                                  )}
                                </Col>
                                <Col span={24}>
                                  <div className="info-item">
                                    <EnvironmentOutlined />{" "}
                                    <span className="text-address">
                                      {o.address}
                                    </span>
                                  </div>
                                </Col>
                              </Row>
                            </div>

                            {/* Footer: Tổng tiền & Action */}
                            <div className="order-neo-footer">
                              <div className="final-summary">
                                <span className="label">TỔNG THANH TOÁN:</span>
                                <span className="amount">
                                  {Number(o.final_amount).toLocaleString()}đ
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {key === "password" && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bento-card main-content"
                >
                  <h4 className="panel-title mb-4">BẢO MẬT HỆ THỐNG</h4>
                  <div style={{ maxWidth: "400px" }}>
                    <Form layout="vertical" className="neo-form">
                      <Form.Item label="MẬT KHẨU HIỆN TẠI">
                        <Input.Password size="large" />
                      </Form.Item>
                      <Form.Item label="MẬT KHẨU MỚI">
                        <Input.Password size="large" />
                      </Form.Item>
                      <Button block size="large" className="btn-neo-outline">
                        CẬP NHẬT MẬT MÃ
                      </Button>
                    </Form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>
      </div>

      <style>{`
        .neo-bento-wrapper {
          background-color: #080808;
          min-height: 100vh;
          color: #e5e5e5;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .bento-card {
          background: #111111;
          border: 1px solid #222;
          border-radius: 24px;
          padding: 30px;
          height: 100%;
        }

        /* Avatar Section */
        .user-profile-card { text-align: center; }
        .avatar-ring {
          position: relative;
          display: inline-block;
          padding: 8px;
          border: 2px dashed #333;
          border-radius: 50%;
          margin-bottom: 20px;
        }
        .online-badge {
          position: absolute; bottom: 8px; right: 8px;
          width: 16px; height: 16px;
          background: #22c55e; border: 3px solid #111; border-radius: 50%;
        }
        .display-name { color: #fff; font-size: 1.4rem; font-weight: 800; margin: 0; }
        .display-email { color: #666; font-size: 13px; }
        .rank-tag { border: none; font-weight: 700; border-radius: 6px; }

        /* Side Nav */
        .side-nav { display: flex; flex-direction: column; gap: 10px; }
        .nav-item {
          display: flex; align-items: center; gap: 15px;
          padding: 16px 20px; border-radius: 14px;
          cursor: pointer; transition: all 0.3s;
          color: #888; border: 1px solid transparent;
        }
        .nav-item:hover { background: #1a1a1a; color: #fff; }
        .nav-item.active {
          background: rgba(234, 179, 8, 0.1);
          color: #FF5302; border-color: rgba(234, 179, 8, 0.2);
        }
        .nav-item .arrow { margin-left: auto; font-size: 10px; opacity: 0.5; }

        /* Stats Grid */
        .stats-dashboard-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;
        }
        .stats-card {
          background: #181818; border: 1px solid #282828;
          border-radius: 18px; padding: 20px;
          display: flex; align-items: center; gap: 15px;
          position: relative; overflow: hidden;
        }
        .stats-icon-wrapper {
          width: 45px; height: 45px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .order-bg { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .money-bg { background: rgba(234, 179, 8, 0.1); color: #FF5302; }
        .stats-label { font-size: 10px; font-weight: 700; color: #ffffff; display: block; }
        .stats-number { font-size: 22px; font-weight: 800; color: #fff; }
        .stats-number.highlight { color: #FF5302; }
        .stats-unit { font-size: 11px; color: #ffffff; margin-left: 4px; font-weight: 600; }
        .stats-decorator { position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; filter: blur(20px); opacity: 0.2; }
        .pulse-blue { background: #3b82f6; }
        .pulse-gold { background: #FF5302; }

        /* Form Custom */
        .panel-title { color: #fff; font-weight: 800; border-left: 4px solid #FF5302; padding-left: 15px; }
        .neo-form .ant-form-item-label label { color: #ffffff !important; font-weight: 700; font-size: 11px; }
        .neo-form .ant-input, .neo-form .ant-input-password, .neo-form .ant-input-textarea {
          background: #1a1a1a !important; border: 1px solid #333 !important;
          color: #fff !important; border-radius: 10px !important;
        }
        .btn-neo-primary {
          background: #FF5302 !important; border: none !important; color: #000 !important;
          font-weight: 800; border-radius: 12px; height: 48px; width: 100%;
        }
        .btn-neo-outline {
          background: transparent !important; border: 1px solid #333 !important;
          color: #fff !important; border-radius: 12px; height: 48px;
        }

        /* Order Items */
        .order-neo-item {
          background: #181818; border-radius: 18px; border: 1px solid #222;
          margin-bottom: 16px; overflow: hidden;
        }
        .order-neo-header {
          padding: 15px 20px; background: #1c1c1c;
          display: flex; justify-content: space-between; align-items: center;
        }
        .order-id { font-size: 12px; color: #cccbcb; }
        .status-tag-custom { border-radius: 4px; font-weight: 800; font-size: 10px; padding: 2px 10px; }
        
        .product-mini-row {
          display: flex; align-items: center; gap: 15px;
          padding: 12px 20px; border-bottom: 1px solid #222;
        }
        .mini-img { width: 45px; height: 45px; border-radius: 8px; object-fit: cover; }
        .product-name { font-size: 13px; font-weight: 700; color: #fff; }
        .product-meta { font-size: 11px; color: #555; }
        .product-total { font-weight: 700; color: #fff; }

        .order-neo-footer {
          padding: 15px 20px; background: #1c1c1c;
          display: flex; justify-content: space-between; align-items: center;
        }
        .delivery-meta { font-size: 11px; color: #c8c8c8; max-width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .final-summary .label { font-size: 10px; color: #555; font-weight: 800; margin-right: 8px; }
        .final-summary .amount { font-size: 18px; font-weight: 900; color: #FF5302; margin-right: 15px; }

        @media (max-width: 768px) {
          .bento-card { padding: 20px; }
          .stats-dashboard-grid { grid-template-columns: 1fr; }
          .order-neo-footer { flex-direction: column; gap: 10px; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
