import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaPhoneAlt, FaMapMarkerAlt, FaArrowUp, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-luxury-dark pt-5 pb-3">
      <Container>
        <Row className="g-5">
          {/* CỘT 1: BRAND STORY */}
          <Col lg={4} md={12}>
            <div className="footer-brand mb-4">
              <h2 className="brand-text">SOUND<span className="accent">HUB</span></h2>
              <div className="brand-line"></div>
            </div>
            <p className="text-dim">
              SoundHub không chỉ bán thiết bị âm thanh, chúng tôi mang đến nghệ thuật thưởng thức âm nhạc đỉnh cao. Đối tác chiến lược của JBL, Marshall và Sony.
            </p>
            <div className="social-glow-group mt-4">
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaYoutube /></a>
              <a href="#" className="social-icon"><SiZalo /></a>
            </div>
          </Col>

          {/* CỘT 2: NAVIGATION */}
          <Col lg={2} md={4} sm={6}>
            <h6 className="footer-heading">KHÁM PHÁ</h6>
            <ul className="footer-nav">
              <li><a href="/">Trang chủ</a></li>
              <li><a href="/san-pham">Cửa hàng</a></li>
              <li><a href="/about">Về chúng tôi</a></li>
              <li><a href="/tin-tuc">Tạp chí âm thanh</a></li>
            </ul>
          </Col>

          {/* CỘT 3: CHÍNH SÁCH */}
          <Col lg={2} md={4} sm={6}>
            <h6 className="footer-heading">HỖ TRỢ</h6>
            <ul className="footer-nav">
              <li><a href="/policy">Chính sách bảo hành</a></li>
              <li><a href="/shipping">Vận chuyển</a></li>
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
              <li><a href="/terms">Điều khoản dịch vụ</a></li>
            </ul>
          </Col>

          {/* CỘT 4: CONTACT INFO */}
          <Col lg={4} md={4}>
            <h6 className="footer-heading">LIÊN HỆ</h6>
            <div className="contact-box">
              <div className="contact-item">
                <FaMapMarkerAlt className="accent" />
                <span>Hoàn Kiếm, Hà Nội, Việt Nam</span>
              </div>
              <div className="contact-item">
                <FaPhoneAlt className="accent" />
                <span>1900 66xx (Hotline)</span>
              </div>
              <div className="contact-item">
                <MdEmail className="accent" />
                <span>tranquangvinh9969@gmail.com</span>
              </div>
            </div>
          </Col>
        </Row>

        <div className="newsletter-box mt-5">
          <Row className="align-items-center p-4 rounded-4" style={{ background: '#111', border: '1px solid #222' }}>
            <Col lg={7}>
              <h5 className="mb-1 text-white">Gia nhập cộng đồng Audiophile</h5>
              <p className="text-dim mb-lg-0 small">Nhận ngay Voucher 10% cho đơn hàng đầu tiên.</p>
            </Col>
            <Col lg={5}>
              <Form className="d-flex glass-form">
                <Form.Control
                  type="email"
                  placeholder="Email của bạn..."
                  className="bg-transparent border-0 text-white ps-3"
                />
                <Button className="btn-accent">Đăng ký</Button>
              </Form>
            </Col>
          </Row>
        </div>

        <hr className="footer-divider my-4" />

        <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
          <p className="small text-dim mb-0">© 2026 SoundHub. Crafted with Passion.</p>
          <div className="payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" />
          </div>
        </div>
      </Container>

      {/* NÚT BACK TO TOP */}
      <button className="back-to-top-glow" onClick={scrollTop}>
        <FaArrowUp />
      </button>

      <style>{`
        .footer-luxury-dark {
          background: #050505;
          color: #fff;
          border-top: 1px solid #1a1a1a;
          font-family: 'Inter', sans-serif;
        }
        .brand-text {
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0;
        }
        .brand-line {
          width: 40px;
          height: 3px;
          background: #ff6600;
          margin-top: 5px;
        }
        .accent { color: #ff6600 !important; }
        .text-dim { color: #888; line-height: 1.6; }
        
        .footer-heading {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 25px;
          color: #fff;
        }

        .footer-nav { list-style: none; padding: 0; }
        .footer-nav li { margin-bottom: 12px; }
        .footer-nav a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: 0.3s all;
        }
        .footer-nav a:hover {
          color: #ff6600;
          padding-left: 8px;
        }

        .contact-box {
          background: #0a0a0a;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #1a1a1a;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 14px;
          color: #bbb;
        }

        .social-icon {
          width: 38px;
          height: 38px;
          background: #111;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #666;
          margin-right: 12px;
          transition: 0.4s;
          border: 1px solid #222;
          text-decoration: none;
        }
        .social-icon:hover {
          background: #ff6600;
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 102, 0, 0.4);
          transform: translateY(-3px);
        }

        .glass-form {
          background: #050505;
          border: 1px solid #333;
          border-radius: 8px;
          overflow: hidden;
        }
        .btn-accent {
          background: #ff6600;
          border: none;
          font-weight: bold;
          padding: 8px 25px;
          border-radius: 0;
        }
        .btn-accent:hover { background: #e65c00; }

        .footer-divider { border-color: #1a1a1a; opacity: 1; }

        .payment-icons img {
          height: 20px;
          margin-left: 15px;
          filter: grayscale(1) brightness(0.7);
        }

        .back-to-top-glow {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: #111;
          color: #ff6600;
          border: 1px solid #ff6600;
          border-radius: 50%;
          cursor: pointer;
          z-index: 1000;
          transition: 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(255, 102, 0, 0.2);
        }
        .back-to-top-glow:hover {
          background: #ff6600;
          color: #fff;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.6);
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;