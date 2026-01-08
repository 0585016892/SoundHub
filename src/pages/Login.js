import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginApi } from "../api/userApi"; // API gửi email & password tới backend
import socket from "../utils/socket";

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

      if (res.success && res.user) {  // ✅ kiểm tra res.user
        login({
          ...res.user,
          token: res.token,
        });

        // Kết nối socket
        if (!socket.connected) socket.connect();
        socket.emit("join", { userId: res.user.id, isAdmin: res.user.role === "customer" });

        navigate("/");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Lỗi server, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh", }}
    >
      <Card style={{ width: "400px", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
        <h2 className="text-center mb-4" style={{ color: "#333" }}>Đăng nhập</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2"
            disabled={loading}
            style={{ borderRadius: "50px", fontWeight: "bold" }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <a href="/forgot-password" style={{ color: "#764ba2" }}>Quên mật khẩu?</a>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
