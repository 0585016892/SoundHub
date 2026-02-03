import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Card, Badge, Row, Col, Spin, Button, Avatar, message } from "antd";
import { motion } from "framer-motion";
import { getUserOrders, updateProfile, changePassword } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { connectOrderSocket } from "../utils/orderSocket";

// Icons AntD
import {
  UserOutlined,
  ShoppingOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  DollarOutlined,
  TagOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const ProfilePage = () => {
  const IMAGE_URL = "http://localhost:20032/uploads/products/";
  const { user, login } = useUser();

  const [key, setKey] = useState("info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updateInfo, setUpdateInfo] = useState({ name: "", phone: "", email: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });

  // Load user
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

  // Socket realtime order status
  useEffect(() => {
    if (!user) return;

    const socket = connectOrderSocket(user.id);

    const handleOrderUpdate = async ({ orderId, order_status }) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status } : o))
      );
      const res = await getUserOrders(user.id);
      setOrders(res.data || []);
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

  // Status badge
  const getStatusBadge = (status) => {
    const map = {
      pending: "processing",
      shipping: "warning",
      completed: "success",
      canceled: "default",
    };
    return <Badge status={map[status]} text={status} />;
  };

  // Update profile
  const handleUpdateInfo = async () => {
    const cleanAddress = updateInfo.address
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");

    const res = await updateProfile(user.token, { ...updateInfo, address: cleanAddress });

    if (res.success) {
      login({ ...user, ...updateInfo, address: cleanAddress });
      message.success("Cập nhật thành công");
    } else {
      message.error(res.message);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm)
      return message.warning("Mật khẩu mới không khớp");

    const res = await changePassword(user.token, passwordForm);
    if (res.success) {
      message.success("Đổi mật khẩu thành công");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <motion.div
        className="d-flex align-items-center p-4 rounded shadow-sm mb-4 bg-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Avatar size={80} src={`https://i.pravatar.cc/100?u=${user?.id}`} />
        <div className="ms-3">
          <h4 className="fw-bold mb-1">Xin chào, {user?.name}</h4>
          <div className="text-muted">{user?.email}</div>
        </div>
      </motion.div>

      <Card className="shadow-sm">
        <Tabs activeKey={key} onChange={setKey} type="card">

          {/* ================= INFO TAB ================= */}
          <TabPane
            tab={<span><UserOutlined /> Thông tin cá nhân</span>}
            key="info"
          >
            <Form layout="vertical" className="mt-3">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Họ và tên">
                    <Input
                      value={updateInfo.name}
                      onChange={(e) => setUpdateInfo({ ...updateInfo, name: e.target.value })}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số điện thoại">
                    <Input
                      value={updateInfo.phone}
                      onChange={(e) => setUpdateInfo({ ...updateInfo, phone: e.target.value })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Email">
                <Input
                  value={updateInfo.email}
                  onChange={(e) => setUpdateInfo({ ...updateInfo, email: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Địa chỉ giao hàng">
                <Input
                  value={updateInfo.address}
                  onChange={(e) => setUpdateInfo({ ...updateInfo, address: e.target.value })}
                />
              </Form.Item>

              <Button type="primary" onClick={handleUpdateInfo}>
                Cập nhật
              </Button>
            </Form>
          </TabPane>

          {/* ================= ORDERS TAB ================= */}
          <TabPane
            tab={<span><ShoppingOutlined /> Đơn hàng của tôi</span>}
            key="orders"
          >
            {loadingOrders ? (
              <div className="text-center py-5">
                <Spin size="large" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <ShoppingOutlined style={{ fontSize: 50 }} />
                <h5>Bạn chưa có đơn hàng nào</h5>
              </div>
            ) : (
              <div style={{ maxHeight: 500, overflowY: "auto" }}>
                {orders.map((o) => (
                  <Card key={o.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <b>Đơn hàng: DH{o.id}</b>
                      {getStatusBadge(o.order_status)}
                    </div>

                    {o.items.map((item) => (
                      <div key={item.id} className="d-flex border-bottom pb-2 mb-2">
                        <img
                          src={`${IMAGE_URL}/${item.image}`}
                          width={60}
                          className="rounded"
                        />
                        <div className="ms-3 flex-grow-1">
                          <b>{item.product_name}</b>
                          <div className="text-muted">
                            SL: {item.quantity} • {Number(item.price).toLocaleString()} đ
                          </div>
                        </div>
                        <b className="text-danger">
                          {Number(item.total).toLocaleString()} đ
                        </b>
                      </div>
                    ))}

                    <div className="mt-2">
                      <div><DollarOutlined /> Tổng hàng: {Number(o.total_amount).toLocaleString()} đ</div>
                      <div><TagOutlined /> Mã giảm giá: {o.coupon_code || "Không"}</div>
                      <div>Giảm: {Number(o.discount_amount || 0).toLocaleString()} đ</div>
                      <h5 className="text-danger fw-bold mt-2">
                        Thanh toán: {Number(o.final_amount).toLocaleString()} đ
                      </h5>
                      <div><EnvironmentOutlined /> {o.address}</div>
                      <div><PhoneOutlined /> {o.phone}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabPane>

          {/* ================= PASSWORD TAB ================= */}
          <TabPane
            tab={<span><LockOutlined /> Đổi mật khẩu</span>}
            key="password"
          >
            <Form layout="vertical" className="mt-3">
              <Form.Item label="Mật khẩu hiện tại">
                <Input.Password
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Mật khẩu mới">
                <Input.Password
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Nhập lại mật khẩu mới">
                <Input.Password
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </Form.Item>

              <Button type="primary" danger onClick={handleChangePassword}>
                Cập nhật mật khẩu
              </Button>
            </Form>
          </TabPane>

        </Tabs>
      </Card>
    </div>
  );
};

export default ProfilePage;
