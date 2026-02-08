import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHandHoldingUsd,
  FaTruckLoading,
  FaCreditCard,
  FaWrench,
  FaHeadset,
} from "react-icons/fa";

// import ảnh
import bando from "../assets/bando.png";
import banner1 from "../assets/khuyen-mai-sony-danh-cho-loa-di-dong-dec_600x800.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.jpg";

const SupportSection = () => {
  const features = [
    { icon: <FaCheckCircle />, text: "CHÍNH HÃNG", sub: "100% Authentic" },
    { icon: <FaHandHoldingUsd />, text: "GIÁ TỐT NHẤT", sub: "Best Price" },
    { icon: <FaTruckLoading />, text: "FREE SHIPPING", sub: "Toàn quốc" },
    { icon: <FaCreditCard />, text: "THANH TOÁN", sub: "Đa nền tảng" },
    { icon: <FaWrench />, text: "BẢO HÀNH", sub: "Dài hạn" },
    { icon: <FaHeadset />, text: "1800.0042", sub: "Hỗ trợ 24/7" },
  ];

  const banners = [banner1, banner2, banner3];

  return (
    <div className="support-dark-wrapper py-5">
      <Container>
        {/* TIÊU ĐỀ CINEMATIC */}
        <div className="text-center mb-5 overflow-hidden">
          <motion.h6 
            initial={{ opacity: 0, letterSpacing: "10px" }}
            whileInView={{ opacity: 1, letterSpacing: "4px" }}
            className="text-orange fw-bold text-uppercase mb-3"
          >
            Trusted by Millions
          </motion.h6>
          <motion.h2 
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            className="text-white fw-black display-5"
          >
            KẾT NỐI ĐAM MÊ KHẮP VIỆT NAM
          </motion.h2>
        </div>

        {/* PHẦN BẢN ĐỒ VÀ BANNER */}
        <Row className="g-4 align-items-stretch mb-5">
          {/* Map Card */}
          <Col lg={4}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="map-glass-card h-100 p-4 d-flex flex-column justify-content-between"
            >
              <div className="map-img-container">
                <Image src={bando} alt="Vietnam Map" fluid className="map-filter" />
              </div>
              <div className="mt-4">
                <h2 className="display-4 fw-black text-orange mb-0">1.000.000+</h2>
                <p className="text-secondary fw-bold">KHÁCH HÀNG TIN DÙNG</p>
                <div className="brand-signature mt-3">
                  <span className="text-white">Sound</span>
                  <span className="text-orange">Hub</span>
                  <small className="d-block text-secondary-50">AUDIO - CINEMA - KARAOKE</small>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Banner Gallery */}
          <Col lg={8}>
            <Row className="h-100 g-3">
              {banners.map((img, idx) => (
                <Col md={4} key={idx}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="banner-hover-card h-100"
                  >
                    <Image src={img} className="img-cover rounded-4" />
                    <div className="banner-overlay"></div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* TÍNH NĂNG (FEATURES) */}
        <div className="features-grid-container mt-5">
          <Row className="g-4 text-center">
            {features.map((f, idx) => (
              <Col xs={6} md={4} lg={2} key={idx}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="feature-minimal-card"
                >
                  <div className="feature-icon-box">{f.icon}</div>
                  <h6 className="text-white fw-bold mt-3 mb-1">{f.text}</h6>
                  <span className="text-secondary small">{f.sub}</span>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      <style>{`
        .support-dark-wrapper {
          background: #050505;
          color: #fff;
        }

        .text-orange { color: #ff6600; }
        .fw-black { font-weight: 900; }

        /* Map Glass Card */
        .map-glass-card {
          background: linear-gradient(135deg, rgba(255,102,0,0.05) 0%, rgba(20,20,20,1) 100%);
          border: 1px solid rgba(255,102,0,0.1);
          border-radius: 30px;
          overflow: hidden;
        }

        .map-filter {
          filter: grayscale(1) invert(1) brightness(0.8) opacity(0.6);
          transition: 0.5s;
        }

        .map-glass-card:hover .map-filter {
          filter: grayscale(0) invert(0) opacity(1);
          transform: scale(1.05);
        }

        /* Banner Gallery */
        .banner-hover-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          cursor: pointer;
        }

        .img-cover {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .banner-hover-card:hover .img-cover {
          transform: scale(1.15);
        }

        .banner-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));
        }

        /* Features Styling */
        .feature-minimal-card {
          padding: 20px;
          transition: 0.3s;
        }

        .feature-icon-box {
          font-size: 2.5rem;
          color: #222;
          transition: 0.3s;
          display: flex;
          justify-content: center;
        }

        .feature-minimal-card:hover .feature-icon-box {
          color: #ff6600;
          transform: translateY(-5px);
          filter: drop-shadow(0 0 10px rgba(255,102,0,0.3));
        }

        .brand-signature {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -1px;
        }

        @media (max-width: 992px) {
          .img-cover { height: 250px; }
        }
      `}</style>
    </div>
  );
};

export default SupportSection;