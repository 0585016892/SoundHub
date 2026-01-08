import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import {
  FaCheckCircle,
  FaDollarSign,
  FaTruck,
  FaCreditCard,
  FaTools,
  FaHeadset,
} from "react-icons/fa";
import bando from '../assets/bando.png'
const SupportSection = () => {
  const features = [
    { icon: <FaCheckCircle size={50} />, text: "SẢN PHẨM CHÍNH HÃNG" },
    { icon: <FaDollarSign size={50} />, text: "GIÁ LUÔN RẺ NHẤT" },
    { icon: <FaTruck size={50} />, text: "MIỄN PHÍ VẬN CHUYỂN" },
    { icon: <FaCreditCard size={50} />, text: "THANH TOÁN ĐA DẠNG" },
    { icon: <FaTools size={50} />, text: "BẢO HÀNH DÀI LÂU" },
    { icon: <FaHeadset size={50} />, text: "HỖ TRỢ TRỌN ĐỜI\n1800.0042" },
  ];

  return (
    <Container className="my-5">
      {/* Tiêu đề */}
      <h3
        className="text-center mb-5 fw-bold"
        style={{
          background: "linear-gradient(90deg, #ff6a00, #ffcc00)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        CÁM ƠN SỰ ỦNG HỘ CỦA KHÁCH HÀNG KHẮP MỌI MIỀN ĐẤT NƯỚC
      </h3>

      {/* Thông tin bản đồ + khách hàng */}
      <Row className="align-items-center mb-5 text-center text-md-start">
        <Col
          md={4}
          className="p-4 rounded shadow"
          style={{ background: "#fff3e0" }}
        >
          <Image
            src={bando}
            alt="Vietnam Map"
            className="mb-3"
            fluid
          />
          <h2 style={{ color: "#ff6a00" }}>1.000.000+</h2>
          <p>Khách hàng đã và đang ủng hộ</p>
          <div className="fw-bold fs-3 d-flex align-items-center">
            <span className="text-dark">Sound</span>
            <span style={{ color: "#ff6b00" }}>Hub</span>
          </div>
          <p>AUDIO - HOME CINEMA - KARAOKE</p>
        </Col>

        {/* Carousel ảnh khách hàng */}
        <Col md={8}>
          <Row className="g-3">
            {["customer1.jpg", "customer2.jpg", "customer3.jpg"].map(
              (img, idx) => (
                <Col xs={4} key={idx}>
                  <Image
                    src={`/images/${img}`}
                    rounded
                    fluid
                    className="shadow-sm border border-light rounded-3 hover-scale"
                  />
                </Col>
              )
            )}
          </Row>
        </Col>
      </Row>

      {/* Tính năng */}
      <Row className="text-center mt-4">
        {features.map((f, idx) => (
          <Col
            xs={6}
            md={2}
            key={idx}
            className="mb-4 d-flex flex-column align-items-center"
          >
            <div
              style={{
                fontSize: "30px",
                background: "linear-gradient(45deg, #ff6a00, #ffcc00)",
                WebkitBackgroundClip: "text",
                color: "#ff5e00",
                transition: "transform 0.3s",
              }}
              className="mb-2 feature-icon"
            >
              {f.icon}
            </div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {f.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </Col>
        ))}
      </Row>

      <style>
        {`
          .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.3s;
          }
          .feature-icon:hover {
            transform: scale(1.3);
          }
        `}
      </style>
    </Container>
  );
};

export default SupportSection;
