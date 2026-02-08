import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginApi } from "../api/userApi";
import socket from "../utils/socket";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ email, password });
      if (res.success && res.user) {
        login({ ...res.user, token: res.token });
        if (!socket.connected) socket.connect();
        socket.emit("join", { userId: res.user.id, isAdmin: res.user.role === "customer" });
        navigate("/");
      } else {
        setError(res.message || "Thông tin đăng nhập không chính xác");
      }
    } catch (err) {
      setError("Lỗi kết nối server, vui lòng kiểm tra lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Hiệu ứng đốm sáng mờ ảo ở nền */}
      <div className="bg-glow"></div>
      
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="login-glass-card"
        >
          <div className="text-center mb-5">
            <h1 className="auth-title">XIN CHÀO!</h1>
            <p className="auth-subtitle">Đăng nhập để tiếp tục trải nghiệm âm thanh đỉnh cao</p>
          </div>

          {error && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <Alert variant="danger" className="auth-alert">{error}</Alert>
            </motion.div>
          )}

          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="mb-4 input-group-custom">
              <label><FiMail className="me-2"/> EMAIL</label>
              <Form.Control
                type="email"
                placeholder="audiophile@soundhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4 input-group-custom">
              <div className="d-flex justify-content-between">
                <label><FiLock className="me-2"/> MẬT KHẨU</label>
                <Link to="/forgot-password" size="sm" className="forgot-link">Quên?</Link>
              </div>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-login-auth w-100 mt-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>ĐĂNG NHẬP <FiArrowRight className="ms-2" /></>
              )}
            </Button>
          </Form>

          <div className="mt-5 text-center footer-auth">
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          </div>
        </motion.div>
      </Container>

      <style>{`
        .login-wrapper {
          background: #050505;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* Nền mờ ảo */
        .bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 102, 0, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          z-index: 0;
        }

        .login-glass-card {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          max-width: 450px;
          padding: 50px 40px;
          border-radius: 24px;
          z-index: 1;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .auth-title {
          color: #fff;
          font-weight: 900;
          letter-spacing: 5px;
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .auth-subtitle {
          color: #666;
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        .auth-alert {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.2);
          color: #ff6b6b;
          border-radius: 12px;
          font-size: 14px;
        }

        .input-group-custom label {
          color: #888;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
          display: block;
        }

        .input-group-custom .form-control {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          padding: 12px 18px;
          border-radius: 12px;
          transition: 0.3s;
        }

        .input-group-custom .form-control:focus {
          border-color: #ff6600 !important;
          box-shadow: 0 0 15px rgba(255, 102, 0, 0.2) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .forgot-link {
          color: #444;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          transition: 0.3s;
        }
        .forgot-link:hover { color: #ff6600; }

        .btn-login-auth {
          background: #ff6600 !important;
          border: none !important;
          padding: 14px !important;
          border-radius: 12px !important;
          font-weight: 800 !important;
          letter-spacing: 2px !important;
          font-size: 14px !important;
          box-shadow: 0 10px 20px rgba(255, 102, 0, 0.2) !important;
          transition: 0.4s !important;
        }

        .btn-login-auth:hover {
          background: #fff !important;
          color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 25px rgba(255, 255, 255, 0.1) !important;
        }

        .footer-auth p {
          color: #555;
          font-size: 14px;
        }

        .footer-auth a {
          color: #ff6600;
          text-decoration: none;
          font-weight: 700;
        }

        .footer-auth a:hover { text-decoration: underline; }

        @media (max-width: 576px) {
          .login-glass-card { padding: 40px 25px; margin: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Login;