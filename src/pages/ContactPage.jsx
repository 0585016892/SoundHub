import React, { useState } from "react";
import { Container, Form, Row, Col, Spinner } from "react-bootstrap";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaFacebook,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { motion } from "framer-motion";
import { sendContactMessage } from "../api/contactApi";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return Swal.fire({ icon: "warning", title: "Thiếu thông tin", text: "Vui lòng điền các trường bắt buộc", background: "#111", color: "#fff" });
    }
    
    setLoading(true);
    try {
      const res = await sendContactMessage(form);
      if (res.success) {
        Swal.fire({ icon: "success", title: "Đã gửi tin nhắn!", text: "Chúng tôi sẽ phản hồi bạn sớm nhất.", background: "#111", color: "#fff", confirmButtonColor: "#ff6600" });
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể gửi tin nhắn lúc này.", background: "#111", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper mt-5">
      {/* SECTION 1: HEADER & MAP OVERLAY */}
      <div className="contact-hero">
        <div className="map-overlay">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473663215206!2d105.7711202758504!3d21.053735986835293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134552defbed8bb%3A0x4211740497f99a41!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBN4buPIC0gxJDhu4thIGNo4bqldA!5e0!3m2!1svi!2s!4v1700000000000" 
            width="100%" height="400" style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(1.2)" }} 
            allowFullScreen="" loading="lazy"
          ></iframe>
        </div>
      </div>

      <Container className="contact-container">
        <Row className="justify-content-center g-0">
          {/* LEFT: INFO PANEL */}
          <Col lg={4}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              className="info-side-panel"
            >
              <h2 className="luxury-title">KẾT NỐI</h2>
              <p className="text-secondary mb-5">Bạn có câu hỏi về âm thanh? Chúng tôi có câu trả lời.</p>

              <div className="contact-method">
                <div className="method-icon"><FaMapMarkerAlt /></div>
                <div className="method-text">
                  <h6>ĐỊA CHỈ</h6>
                  <p>Trường Đại học Mỏ địa chất, Hà Nội</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon"><FaPhone /></div>
                <div className="method-text">
                  <h6>ĐIỆN THOẠI</h6>
                  <p>+84 35 949 8869</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon"><FaEnvelope /></div>
                <div className="method-text">
                  <h6>EMAIL</h6>
                  <p>support@soundhub.com</p>
                </div>
              </div>

              <div className="social-links mt-5">
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaYoutube /></a>
              </div>
            </motion.div>
          </Col>

          {/* RIGHT: FORM PANEL */}
          <Col lg={7}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              className="form-side-panel"
            >
              <h3 className="mb-4 fw-black">GỬI TIN NHẮN CHO CHÚNG TÔI</h3>
              <Form onSubmit={handleSubmit} className="dark-contact-form">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4 custom-field">
                      <Form.Label><FaUser className="me-2 accent" /> TÊN CỦA BẠN</Form.Label>
                      <Form.Control 
                        placeholder="John Doe" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4 custom-field">
                      <Form.Label><FaEnvelope className="me-2 accent" /> EMAIL</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="name@company.com" 
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4 custom-field">
                  <Form.Label><FaPhone className="me-2 accent" /> SỐ ĐIỆN THOẠI</Form.Label>
                  <Form.Control 
                    placeholder="035 XXX XXXX" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </Form.Group>

                <Form.Group className="mb-5 custom-field">
                  <Form.Label>NỘI DUNG THẢO LUẬN</Form.Label>
                  <Form.Control 
                    as="textarea" rows={4} 
                    placeholder="Tôi muốn tìm hiểu về hệ thống loa Hi-End..." 
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </Form.Group>

                <button className="btn-send-message" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : <><FaPaperPlane className="me-2" /> GỬI YÊU CẦU</>}
                </button>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .contact-wrapper { background: #050505; min-height: 100vh; color: #fff; padding-bottom: 100px; }
        .accent { color: #ff6600; }
        .fw-black { font-weight: 900; letter-spacing: -1px; }

        /* Hero & Map */
        .contact-hero { position: relative; height: 400px; overflow: hidden; }
        .map-overlay { position: absolute; width: 100%; top: 0; filter: contrast(1.1); }
        .map-overlay::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 150px;
          background: linear-gradient(transparent, #050505);
        }

        .contact-container { margin-top: -100px; position: relative; z-index: 10; }

        /* Panels */
        .info-side-panel {
          background: #ff6600; color: #000; padding: 60px 40px; border-radius: 24px 0 0 24px;
          height: 100%; display: flex; flex-direction: column; justify-content: center;
        }
        .luxury-title { font-weight: 900; letter-spacing: 5px; font-size: 2.5rem; margin-bottom: 10px; }

        .form-side-panel {
          background: #0a0a0a; padding: 60px; border-radius: 0 24px 24px 0;
          border: 1px solid rgba(255,255,255,0.05); border-left: none;
        }

        /* Contact Methods */
        .contact-method { display: flex; gap: 20px; margin-bottom: 25px; align-items: center; }
        .method-icon { 
          width: 45px; height: 45px; background: #000; color: #ff6600; 
          display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 20px;
        }
        .method-text h6 { font-weight: 800; margin: 0; font-size: 13px; letter-spacing: 1px; }
        .method-text p { margin: 0; font-size: 15px; opacity: 0.8; }

        .social-links { display: flex; gap: 20px; }
        .social-links a { color: #000; font-size: 22px; transition: 0.3s; }
        .social-links a:hover { transform: translateY(-5px); opacity: 0.7; }

        /* Form Custom */
        .custom-field label { font-size: 11px; font-weight: 800; color: #444; letter-spacing: 1px; margin-bottom: 12px; }
        .custom-field .form-control {
          background: #111 !important; border: 1px solid #1a1a1a !important; color: #fff !important;
          padding: 15px; border-radius: 12px; transition: 0.3s;
        }
        .custom-field .form-control:focus {
          border-color: #ff6600 !important; box-shadow: 0 0 15px rgba(255,102,0,0.1) !important;
        }

        .btn-send-message {
          background: #ff6600; border: none; color: #fff; width: 100%; padding: 18px;
          border-radius: 12px; font-weight: 900; letter-spacing: 2px; transition: 0.4s;
          box-shadow: 0 10px 20px rgba(255,102,0,0.2);
        }
        .btn-send-message:hover { background: #fff; color: #000; transform: translateY(-3px); }

        @media (max-width: 992px) {
          .info-side-panel { border-radius: 24px 24px 0 0; }
          .form-side-panel { border-radius: 0 0 24px 24px; border-left: 1px solid rgba(255,255,255,0.05); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;