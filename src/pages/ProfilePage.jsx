import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Row, Col, Spin, Button, Avatar, message, Tag } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { getUserOrders, updateProfile, changePassword } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { connectOrderSocket } from "../utils/orderSocket";

// Icons
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
  MailOutlined
} from "@ant-design/icons";

const ProfilePage = () => {
  const IMAGE_URL = "http://localhost:20032/uploads/products/";
  const { user, login } = useUser();

  const [key, setKey] = useState("info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updateInfo, setUpdateInfo] = useState({ name: "", phone: "", email: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

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
      message.info(`Đơn hàng DH${orderId} đã cập nhật trạng thái: ${order_status}`);
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
      pending: { color: "gold", icon: <ClockCircleOutlined />, text: "Chờ xử lý" },
      shipping: { color: "blue", icon: <TruckOutlined />, text: "Đang giao" },
      completed: { color: "green", icon: <CheckCircleOutlined />, text: "Hoàn thành" },
      canceled: { color: "red", icon: <CloseCircleOutlined />, text: "Đã hủy" },
    };
    const s = config[status] || config.pending;
    return <Tag icon={s.icon} color={s.color} className="status-tag">{s.text.toUpperCase()}</Tag>;
  };

  return (
    <div className="profile-wrapper py-5 mt-5">
      <div className="container">
        {/* USER HEADER CARD */}
        <motion.div 
          className="user-hero-card mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex align-items-center gap-4 p-4">
            <div className="avatar-wrapper">
              <Avatar size={100} src={`https://i.pravatar.cc/150?u=${user?.id}`} border={4} />
              <div className="online-indicator"></div>
            </div>
            <div>
              <h2 className="text-white fw-black mb-1">{user?.name?.toUpperCase()}</h2>
              <p className="text-secondary mb-0"><MailOutlined className="me-2" />{user?.email}</p>
              <Tag color="#ff6600" className="mt-2 mt-md-3">MEMBER AUDIOPHILE</Tag>
            </div>
          </div>
        </motion.div>

        <div className="profile-content-grid">
          <Tabs 
            activeKey={key} 
            onChange={setKey} 
            className="custom-profile-tabs"
            tabPosition="left"
          >
            {/* TAB: THÔNG TIN */}
            <Tabs.TabPane 
              tab={<span><UserOutlined /> TÀI KHOẢN</span>} 
              key="info"
            >
              <div className="glass-panel p-4">
                <h4 className="panel-title">THÔNG TIN CÁ NHÂN</h4>
                <Form layout="vertical" className="dark-form">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="HỌ VÀ TÊN">
                        <Input value={updateInfo.name} onChange={e => setUpdateInfo({...updateInfo, name: e.target.value})} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="SỐ ĐIỆN THOẠI">
                        <Input value={updateInfo.phone} onChange={e => setUpdateInfo({...updateInfo, phone: e.target.value})} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="ĐỊA CHỈ GIAO HÀNG">
                    <Input.TextArea rows={3} value={updateInfo.address} onChange={e => setUpdateInfo({...updateInfo, address: e.target.value})} />
                  </Form.Item>
                  <Button className="btn-accent mt-3" onClick={() => message.success("Đã cập nhật!")}>LƯU THAY ĐỔI</Button>
                </Form>
              </div>
            </Tabs.TabPane>

            {/* TAB: ĐƠN HÀNG */}
            <Tabs.TabPane 
              tab={<span><ShoppingOutlined /> ĐƠN HÀNG</span>} 
              key="orders"
            >
              <div className="glass-panel p-4">
                <h4 className="panel-title">LỊCH SỬ MUA SẮM</h4>
                {loadingOrders ? (
                  <div className="text-center py-5"><Spin itemColor="#ff6600" /></div>
                ) : (
                  <div className="order-list-scroll">
                    {orders.map(o => (
                      <div key={o.id} className="order-item-card mb-4">
                        <div className="order-header d-flex justify-content-between align-items-center mb-3">
                          <span className="order-id">MÃ ĐƠN: #DH{o.id}</span>
                          {getStatusTag(o.order_status)}
                        </div>
                        {o.items.map(item => (
                          <div key={item.id} className="d-flex gap-3 mb-3 item-row">
                            <img src={IMAGE_URL + item.image} width={60} height={60} className="rounded object-fit-cover" alt="" />
                            <div className="flex-grow-1">
                              <div className="text-white fw-bold">{item.product_name}</div>
                              <div className="text-secondary small">SL: {item.quantity} × {Number(item.price).toLocaleString()}đ</div>
                            </div>
                            <div className="text-white fw-bold">{Number(item.total).toLocaleString()}đ</div>
                          </div>
                        ))}
                        <div className="order-footer pt-3 mt-2 border-top border-secondary d-flex justify-content-between align-items-end">
                          <div className="shipping-info">
                             <div className="small text-secondary"><PhoneOutlined className="me-1"/> {o.phone}</div>
                             <div className="small text-secondary"><EnvironmentOutlined className="me-1"/> {o.address}</div>
                          </div>
                          <div className="text-end">
                            <div className="small text-secondary">TỔNG THANH TOÁN</div>
                            <div className="total-price">{Number(o.final_amount).toLocaleString()}đ</div>
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
              tab={<span><LockOutlined /> BẢO MẬT</span>} 
              key="password"
            >
              <div className="glass-panel p-4">
                <h4 className="panel-title">ĐỔI MẬT KHẨU</h4>
                <Form layout="vertical" className="dark-form">
                  <Form.Item label="MẬT KHẨU HIỆN TẠI">
                    <Input.Password placeholder="••••••••" />
                  </Form.Item>
                  <Form.Item label="MẬT KHẨU MỚI">
                    <Input.Password placeholder="••••••••" />
                  </Form.Item>
                  <Button className="btn-accent-outline" onClick={() => message.success("Đã đổi mật khẩu!")}>CẬP NHẬT MẬT KHẨU</Button>
                </Form>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

      <style>{`
        .profile-wrapper { background: #050505; min-height: 100vh; color: #fff; }
        .fw-black { font-weight: 900; }
        
        /* Hero Card */
        .user-hero-card { 
          background: linear-gradient(135deg, #111 0%, #050505 100%);
          border: 1px solid #1a1a1a;
          border-radius: 20px;
          overflow: hidden;
        }
        .avatar-wrapper { position: relative; }
        .online-indicator {
          position: absolute; bottom: 5px; right: 5px; width: 15px; height: 15px;
          background: #52c41a; border: 3px solid #111; border-radius: 50%;
        }

        /* Tabs Styling */
        .custom-profile-tabs .ant-tabs-nav { background: #0a0a0a; border-radius: 15px; padding: 10px; border: 1px solid #1a1a1a; }
        .custom-profile-tabs .ant-tabs-tab { color: #888 !important; border-radius: 8px !important; margin: 5px 0 !important; transition: 0.3s; padding: 12px 20px !important; }
        .custom-profile-tabs .ant-tabs-tab-active { background: #ff6600 !important; }
        .custom-profile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #fff !important; font-weight: 800; }
        .custom-profile-tabs .ant-tabs-ink-bar { display: none; }

        /* Panels */
        .glass-panel { background: #0a0a0a; border-radius: 20px; border: 1px solid #1a1a1a; min-height: 500px; }
        .panel-title { color: #ff6600; font-weight: 900; letter-spacing: 2px; margin-bottom: 30px; font-size: 1.2rem; }

        /* Forms */
        .dark-form .ant-form-item-label label { color: #666 !important; font-weight: 800; font-size: 11px; letter-spacing: 1px; }
        .dark-form .ant-input, .dark-form .ant-input-password, .dark-form .ant-input-affix-wrapper {
          background: #111 !important; border: 1px solid #222 !important; color: #fff !important; border-radius: 8px; padding: 10px;
        }
        .dark-form .ant-input:focus { border-color: #ff6600 !important; box-shadow: 0 0 10px rgba(255,102,0,0.1); }

        /* Buttons */
        .btn-accent { background: #ff6600; border: none; color: #fff; font-weight: 800; padding: 0 30px; height: 45px; border-radius: 8px; }
        .btn-accent:hover { background: #fff !important; color: #000 !important; }
        .btn-accent-outline { background: transparent; border: 1px solid #ff6600; color: #ff6600; font-weight: 800; height: 45px; border-radius: 8px; }

        /* Order Cards */
        .order-item-card { background: #111; border-radius: 15px; padding: 20px; border: 1px solid #222; }
        .order-id { font-weight: 800; color: #fff; letter-spacing: 1px; }
        .status-tag { border-radius: 50px; font-weight: 800; font-size: 10px; padding: 2px 12px; }
        .total-price { color: #ff6600; font-weight: 900; font-size: 1.4rem; }
        .order-list-scroll { max-height: 600px; overflow-y: auto; padding-right: 10px; }
        .order-list-scroll::-webkit-scrollbar { width: 5px; }
        .order-list-scroll::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ProfilePage;