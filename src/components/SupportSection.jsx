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

// import ảnh
import bando from "../assets/bando.png";
import banner1 from "../assets/khuyen-mai-sony-danh-cho-loa-di-dong-dec_600x800.webp";
import banner2 from "../assets/banner2.webp";
// import thêm nếu có
// import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.jpg";

const SupportSection = () => {
  const features = [
    { icon: <FaCheckCircle size={50} />, text: "SẢN PHẨM CHÍNH HÃNG" },
    { icon: <FaDollarSign size={50} />, text: "GIÁ LUÔN RẺ NHẤT" },
    { icon: <FaTruck size={50} />, text: "MIỄN PHÍ VẬN CHUYỂN" },
    { icon: <FaCreditCard size={50} />, text: "THANH TOÁN ĐA DẠNG" },
    { icon: <FaTools size={50} />, text: "BẢO HÀNH DÀI LÂU" },
    { icon: <FaHeadset size={50} />, text: "HỖ TRỢ TRỌN ĐỜI\n1800.0042" },
  ];

  // Banner ảnh khách hàng / khuyến mãi
  const banners = [
    { image: banner1 },
    { image: banner2 },
    { image: banner3 },
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

      {/* Bản đồ + banner */}
      <Row className="align-items-center mb-5 text-center text-md-start">
        {/* Map + info */}
        <Col
          md={4}
          className="p-4 rounded shadow"
          style={{ background: "#fff3e0" }}
        >
          <Image src={bando} alt="Vietnam Map" className="mb-3" fluid />

          <h2 style={{ color: "#ff6a00" }}>1.000.000+</h2>
          <p>Khách hàng đã và đang ủng hộ</p>

          <div className="fw-bold fs-3 d-flex justify-content-center justify-content-md-start align-items-center">
            <span className="text-dark">Sound</span>
            <span style={{ color: "#ff6b00" }}>Hub</span>
          </div>

          <p>AUDIO - HOME CINEMA - KARAOKE</p>
        </Col>

        {/* Banner */}
        <Col md={8}>
          <Row className="g-3">
            {banners.map((item, idx) => (
              <Col xs={4} key={idx}>
                <Image
                  src={item.image}
                  rounded
                  fluid
                  className="shadow-sm border border-light rounded-3 hover-scale h-100"
                />
              </Col>
            ))}
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
              className="mb-2 feature-icon"
              style={{
                background: "linear-gradient(45deg, #ff6a00, #ffcc00)",
                WebkitBackgroundClip: "text",
                color: "#ff6a00",
                transition: "transform 0.3s",
              }}
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

      {/* CSS */}
      <style>
        {`
          .hover-scale {
            transition: transform 0.3s;
          }
          .hover-scale:hover {
            transform: scale(1.05);
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
