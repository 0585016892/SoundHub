import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTruck,
  FaHeadset
} from "react-icons/fa";
import { motion } from "framer-motion";
import { sendContactMessage } from "../api/contactApi";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", bg: "success", icon: null, id: null });

  // Hàm hiển thị toast
  const showToast = (message, type = "success") => {
    let bg, icon;
    switch (type) {
      case "success":
        bg = "success";
        icon = <FaCheckCircle className="me-2" />;
        break;
      case "danger":
        bg = "danger";
        icon = <FaExclamationCircle className="me-2" />;
        break;
      case "warning":
        bg = "warning";
        icon = <FaInfoCircle className="me-2" />;
        break;
      default:
        bg = "primary";
        icon = null;
    }
    setToast({ show: true, message, bg, icon, id: Date.now() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return showToast("Vui lòng điền đầy đủ thông tin", "warning");
    }
    setLoading(true);
    try {
      const res = await sendContactMessage(form);
      if (res.success) {
        showToast("Gửi liên hệ thành công!", "success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        showToast(res.message || "Gửi thất bại", "danger");
      }
    } catch (error) {
      console.error(error);
      showToast("Gửi thất bại, vui lòng thử lại", "danger");
    } finally {
      setLoading(false);
    }
  };

  const highlightCards = [
    { icon: <FaShieldAlt size={24} className="text-primary" />, title: "Bảo hành 1 năm", desc: "Sản phẩm được bảo hành đầy đủ" },
    { icon: <FaHeadset size={24} className="text-success" />, title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng hỗ trợ bạn" },
    { icon: <FaTruck size={24} className="text-warning" />, title: "Giao hàng nhanh", desc: "Đơn hàng đến tay bạn nhanh chóng" },
  ];

  return (
    <Container fluid className="py-5" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Card highlight trên cùng */}
      <Row className="mb-5 justify-content-center">
        {highlightCards.map((c, idx) => (
          <Col key={idx} md={3} className="mb-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="shadow-sm border-0 rounded-4 text-center py-3 h-100">
                <div className="mb-2">{c.icon}</div>
                <h6 className="fw-bold">{c.title}</h6>
                <small className="text-muted">{c.desc}</small>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-center fw-bold"
      >
        Liên Hệ Với Chúng Tôi
      </motion.h2>

      <Row className="justify-content-center">
        {/* Form liên hệ */}
        <Col md={6} className="mb-4">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaUser className="me-2 text-primary" />Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaEnvelope className="me-2 text-primary" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaPhone className="me-2 text-primary" />Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold"><FaInfoCircle className="me-2 text-primary" />Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Nhập nội dung liên hệ"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-2 fw-bold"
                    style={{ background: "linear-gradient(90deg, #4e54c8, #8f94fb)", border: "none" }}
                  >
                    {loading ? "Đang gửi..." : "Gửi liên hệ"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* Thông tin liên hệ */}
        <Col md={4}>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="shadow-lg border-0 rounded-4 p-4 h-100">
              <h5 className="mb-4 fw-bold text-primary">Thông tin liên hệ</h5>
              <p className="mb-3"><FaMapMarkerAlt className="me-2 text-danger" />Trường Đại học Mỏ địa chất</p>
              <p className="mb-3"><FaPhone className="me-2 text-success" />+84 35 949 8869</p>
              <p className="mb-3"><FaEnvelope className="me-2 text-warning" />tranquangvinh9969@gmail.com</p>
              <p className="mb-3">Giờ làm việc: 24/7</p>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Toast thông báo */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {toast.show && (
          <Toast
            key={toast.id}
            onClose={() => setToast({ ...toast, show: false })}
            bg={toast.bg}
            autohide
            delay={3000}
            style={{ minWidth: "250px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <Toast.Body className="d-flex align-items-center">{toast.icon}<span>{toast.message}</span></Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </Container>
  );
};

export default ContactPage;
