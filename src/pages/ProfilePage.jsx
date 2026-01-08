import React, { useState, useEffect } from "react";
import { Tabs, Tab, Form, Card, Badge, Row, Col, Spinner, Button, Toast, ToastContainer } from "react-bootstrap";
import { motion } from "framer-motion";
import { getUserOrders, updateProfile, changePassword } from "../api/userApi";
import { useUser } from "../context/UserContext";
import { connectOrderSocket } from "../utils/orderSocket.js";

// React Icons
import { 
  FaBoxOpen, 
  FaUserEdit, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaTag, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaMoneyBillWave, 
  FaDollarSign 
} from "react-icons/fa";

const ProfilePage = () => {
  const IMAGE_URL = "http://localhost:5000/uploads/products/";
  const { user, login } = useUser();

  const [key, setKey] = useState("info");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updateInfo, setUpdateInfo] = useState({ name: "", phone: "", email: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [toast, setToast] = useState({ show: false, message: "", bg: "success", icon: null });

  useEffect(() => {
    if (!user) return;
    setUpdateInfo({ name: user.name, email: user.email, phone: user.phone, address: user.address });
    loadOrders();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const socket = connectOrderSocket(user.id);
    const handleOrderUpdate = async ({ orderId, order_status }) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status } : o));
      try {
        const res = await getUserOrders(user.id);
        setOrders(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("connect", () => console.log("✅ Socket FE kết nối:", socket.id));
    socket.on("orderStatusUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderStatusUpdated", handleOrderUpdate);
    };
  }, [user]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getUserOrders(user.id);
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <Badge bg="warning">Chờ xác nhận</Badge>;
      case "shipping": return <Badge bg="info">Đang giao</Badge>;
      case "completed": return <Badge bg="success">Hoàn thành</Badge>;
      case "canceled": return <Badge bg="secondary">Đã hủy</Badge>;
      default: return <Badge bg="dark">{status}</Badge>;
    }
  };

  const showToast = (message, bg = "success", icon = null) => setToast({ show: true, message, bg, icon });

  const handleUpdateInfo = async () => {
    const cleanAddress = updateInfo.address.split(",").map(s => s.trim()).filter(Boolean).join(", ");
    const res = await updateProfile(user.token, { ...updateInfo, address: cleanAddress });
    if (res.success) {
      login({ ...user, ...updateInfo, address: cleanAddress });
      showToast("Cập nhật thành công", "success", <FaCheckCircle className="me-2" />);
    } else {
      showToast(res.message, "danger", <FaExclamationCircle className="me-2" />);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      return showToast("Mật khẩu mới không khớp", "warning", <FaInfoCircle className="me-2" />);
    }
    const res = await changePassword(user.token, passwordForm);
    showToast(
      res.success ? "Đổi mật khẩu thành công" : res.message,
      res.success ? "success" : "danger",
      res.success ? <FaCheckCircle className="me-2" /> : <FaExclamationCircle className="me-2" />
    );
    if (res.success) setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="container py-4">
      <motion.div className="d-flex align-items-center p-4 rounded shadow-sm mb-4 bg-white" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <img src={`https://i.pravatar.cc/100?u=${user?.id}`} alt="avatar" className="rounded-circle me-3 border shadow-sm" width="80" />
        <div>
          <h4 className="fw-bold mb-1">Xin chào, {user?.name}</h4>
          <div className="text-muted">{user?.email}</div>
        </div>
      </motion.div>

      <Card className="shadow-sm rounded">
        <Card.Body>
          <Tabs activeKey={key} onSelect={setKey} justify className="tiki-tabs mb-3">

            <Tab eventKey="info" title={<span className="d-flex align-items-center gap-1"><FaUserEdit /> Thông tin cá nhân</span>}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Form className="px-2 py-3">
                  <Row>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Họ và tên</Form.Label><Form.Control value={updateInfo.name} onChange={e => setUpdateInfo({ ...updateInfo, name: e.target.value })} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-3"><Form.Label>Số điện thoại</Form.Label><Form.Control value={updateInfo.phone} onChange={e => setUpdateInfo({ ...updateInfo, phone: e.target.value })} /></Form.Group></Col>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control value={updateInfo.email} onChange={e => setUpdateInfo({ ...updateInfo, email: e.target.value })} /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Địa chỉ giao hàng</Form.Label><Form.Control value={updateInfo.address} onChange={e => setUpdateInfo({ ...updateInfo, address: e.target.value })} /></Form.Group>
                  <Button variant="primary" onClick={handleUpdateInfo}>Cập nhật</Button>
                </Form>
              </motion.div>
            </Tab>

            <Tab eventKey="orders" title={<span className="d-flex align-items-center gap-1"><FaBoxOpen /> Đơn hàng của tôi</span>}>
              {loadingOrders ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 text-muted"><FaBoxOpen size={60} className="opacity-50 mb-3" /><h5>Bạn chưa có đơn hàng nào</h5></div>
              ) : (
                <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "5px" }}>
                  {orders.map((o, idx) => (
                    <Card className="mb-3 shadow-sm" key={`${o.id}-${idx}`}>
                      <Card.Header className="d-flex justify-content-between">
                        <span className="fw-bold text-primary">Đơn hàng: DH00{o.id}</span>
                        {getStatusBadge(o.order_status)}
                      </Card.Header>
                      <Card.Body>
                        {o.items.map(item => (
                          <div className="d-flex border-bottom pb-2 mb-2" key={`${item.id}-${Math.random()}`}>
                            <img src={`${IMAGE_URL}/${item.image}`} width="70" className="rounded me-3" />
                            <div>
                              <div className="fw-semibold">{item.product_name}</div>
                              <div className="text-muted small">SL: {item.quantity} • Giá: {Number(item.price).toLocaleString()} đ</div>
                            </div>
                            <div className="ms-auto fw-bold text-danger">{Number(item.total).toLocaleString()} đ</div>
                          </div>
                        ))}
                        <div className="mt-2">
                          <div><FaBoxOpen /> Tổng tiền hàng: <b>{Number(o.total_amount).toLocaleString()} đ</b></div>
                          <div><FaTag /> Mã giảm giá: {o.coupon_code || "Không"}</div>
                          <div><FaDollarSign /> Giảm: {Number(o.discount_amount || 0).toLocaleString()} đ</div>
                          <div className="fw-bold fs-5 text-danger mt-2"><FaMoneyBillWave /> Tổng thanh toán: {Number(o.final_amount).toLocaleString()} đ</div>
                          <div className="mt-2"><FaMapMarkerAlt /> {o.address} <br /><FaPhone /> {o.phone}</div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Tab>

            <Tab eventKey="password" title={<span className="d-flex align-items-center gap-1"><FaShieldAlt /> Đổi mật khẩu</span>}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Form className="px-2 py-3">
                  <Form.Group className="mb-3"><Form.Label>Mật khẩu hiện tại</Form.Label><Form.Control type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Mật khẩu mới</Form.Label><Form.Control type="password" value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} /></Form.Group>
                  <Form.Group className="mb-3"><Form.Label>Nhập lại mật khẩu mới</Form.Label><Form.Control type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} /></Form.Group>
                  <Button variant="dark" onClick={handleChangePassword}>Cập nhật mật khẩu</Button>
                </Form>
              </motion.div>
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide bg={toast.bg} style={{ minWidth: "250px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          <Toast.Body className="d-flex align-items-center">{toast.icon}<span>{toast.message}</span></Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ProfilePage;
