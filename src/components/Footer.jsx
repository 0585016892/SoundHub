import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaPhoneAlt, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-dark pt-5 pb-3 mt-5 text-light position-relative">
      <Container>
        <Row className="g-4">
          {/* LOGO */}
          <Col md={4}>
            <div className="d-flex mb-2">
              <h2 className="fw-bold text-white me-1">Sound</h2>
              <h2 className="fw-bold" style={{ color: "#ff6b00" }}>Hub</h2>
            </div>
            <p className="text-secondary">
              Mang đến trải nghiệm âm thanh đỉnh cao với loa, tai nghe và phụ kiện
              chính hãng.
            </p>
          </Col>

          {/* LINK NHANH */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">Liên kết nhanh</h5>
            <ul className="footer-links">
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/san-pham">Sản phẩm</a></li>
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/lien-he">Liên hệ</a></li>
            </ul>
          </Col>

          {/* LIÊN HỆ */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">Liên hệ</h5>
            <p className="mb-1"><FaMapMarkerAlt /> Hà Nội, Việt Nam</p>
            <p className="mb-1"><FaPhoneAlt /> 0123 456 xxx</p>
            <p className="mb-3"><MdEmail /> tranquangvinh9969@gmail.com</p>

            <div className="d-flex">
              <a href="https://facebook.com" className="footer-icon facebook me-2">
                <FaFacebookF />
              </a>
              <a href="https://zalo.me/0123456789" className="footer-icon zalo">
                <SiZalo />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        {/* NEWSLETTER */}
        <Row className="align-items-center">
          <Col md={8}>
            <p className="mb-2 mb-md-0">
              📩 Đăng ký để nhận ưu đãi & sản phẩm mới nhất
            </p>
          </Col>
          <Col md={4}>
            <Form className="d-flex">
              <Form.Control
                type="email"
                placeholder="Nhập email..."
                className="me-2"
              />
              <Button variant="warning">Gửi</Button>
            </Form>
          </Col>
        </Row>

        <hr className="border-secondary my-3" />

        <Row>
          <Col className="text-center small text-secondary">
            © 2026 SoundHub
          </Col>
        </Row>
      </Container>

      {/* BACK TO TOP */}
      <button className="back-to-top" onClick={scrollTop}>
        <FaArrowUp />
      </button>

      {/* CSS */}
      <style jsx>{`
        .footer-links {
          list-style: none;
          padding: 0;
        }
        .footer-links li {
          margin-bottom: 8px;
        }
        .footer-links a {
          color: #adb5bd;
          text-decoration: none;
          transition: 0.3s;
        }
        .footer-links a:hover {
          color: #ff6b00;
          padding-left: 6px;
        }
        .footer-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: 0.3s;
        }
        .facebook {
          background: #3b5998;
        }
        .zalo {
          background: #007fff;
        }
        .footer-icon:hover {
          transform: scale(1.1);
        }
        .back-to-top {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: #ff6b00;
          color: white;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0,0,0,.3);
          transition: 0.3s;
        }
        .back-to-top:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
