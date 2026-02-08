import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaMusic, 
  FaGem, 
  FaUsers, 
  FaAward, 
  FaMicrophoneAlt, 
  FaHistory 
} from "react-icons/fa";

const AboutPage = () => {
  const stats = [
    { icon: <FaHistory />, value: "10+", label: "Năm kinh nghiệm" },
    { icon: <FaUsers />, value: "50k+", label: "Khách hàng tin dùng" },
    { icon: <FaAward />, value: "100%", label: "Sản phẩm chính hãng" },
    { icon: <FaMusic />, value: "500+", label: "Thiết bị Hi-End" },
  ];

  return (
    <div className="about-wrapper">
      {/* SECTION 1: HERO - TUYÊN NGÔN */}
      <section className="about-hero">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container text-center"
        >
          <span className="brand-badge">SOUNDHUB STORY</span>
          <h1 className="hero-title">ĐỊNH NGHĨA LẠI<br/><span className="accent">CHUẨN MỰC ÂM THANH</span></h1>
          <p className="hero-subtitle">
            Chúng tôi không chỉ bán thiết bị, chúng tôi mang đến trải nghiệm nghệ thuật 
            đích thực cho những tâm hồn yêu âm nhạc.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2: VISION & MISSION */}
      <Container className="py-5 my-5">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="image-frame"
            >
              <img 
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80" 
                alt="Audiophile Life" 
                className="img-fluid rounded-4 shadow-lg"
              />
              <div className="experience-tag">EST. 2014</div>
            </motion.div>
          </Col>
          <Col lg={6}>
            <div className="ps-lg-4">
              <h6 className="accent fw-bold letter-spacing-2">TẦM NHÌN CỦA CHÚNG TÔI</h6>
              <h2 className="text-white fw-black mb-4">ÂM THANH LÀ LINH HỒN CỦA KHÔNG GIAN</h2>
              <p className="text-secondary mb-4 lh-lg">
                Tại SoundHub, chúng tôi tin rằng mỗi nốt nhạc đều xứng đáng được tái tạo 
                một cách trung thực nhất. Được thành lập từ niềm đam mê mãnh liệt của 
                những kỹ sư âm thanh, chúng tôi đã hành trình khắp nơi để tuyển chọn 
                những thương hiệu loa và tai nghe danh tiếng nhất thế giới.
              </p>
              <ul className="vision-list">
                <li><FaGem className="accent me-2" /> Tuyển chọn khắt khe về chất âm.</li>
                <li><FaMicrophoneAlt className="accent me-2" /> Công nghệ âm thanh tiên phong.</li>
                <li><FaMusic className="accent me-2" /> Thấu hiểu gu thưởng thức cá nhân.</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>

      {/* SECTION 3: STATS COUNTER */}
      <section className="stats-section py-5">
        <Container>
          <Row className="g-4">
            {stats.map((stat, idx) => (
              <Col key={idx} md={3} sm={6}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="stat-card"
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* SECTION 4: CORE VALUES (BENTO GRID) */}
      <Container className="py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="text-white fw-black">GIÁ TRỊ CỐT LÕI</h2>
        </div>
        <div className="bento-grid">
          <div className="bento-item p-4">
            <h4>CHÍNH HÃNG 100%</h4>
            <p>Cam kết hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái.</p>
          </div>
          <div className="bento-item p-4 highlight">
            <h4>TRẢI NGHIỆM THỰC</h4>
            <p>Hệ thống phòng nghe thử đạt chuẩn quốc tế tại trung tâm Hà Nội.</p>
          </div>
          <div className="bento-item p-4">
            <h4>HỖ TRỢ TRỌN ĐỜI</h4>
            <p>Đội ngũ kỹ thuật viên đồng hành cùng thiết bị của bạn mãi mãi.</p>
          </div>
        </div>
      </Container>

      <style>{`
        .about-wrapper { background: #050505; color: #fff; overflow: hidden; }
        .accent { color: #ff6600; }
        .fw-black { font-weight: 900; letter-spacing: -1px; }
        .letter-spacing-2 { letter-spacing: 2px; }

        /* Hero Section */
        .about-hero {
          height: 70vh;
          display: flex;
          align-items: center;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
                      url('https://images.unsplash.com/photo-1558000593-3b1811839db0?auto=format&fit=crop&w=1500&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .brand-badge {
          background: #ff6600; color: #000; padding: 5px 15px;
          font-weight: 800; font-size: 12px; border-radius: 50px;
        }
        .hero-title { font-size: 4rem; font-weight: 900; color: #fff; margin-top: 20px; }
        .hero-subtitle { font-size: 1.2rem; color: #aaa; max-width: 600px; margin: 20px auto; }

        /* Image Frame */
        .image-frame { position: relative; }
        .experience-tag {
          position: absolute; bottom: -20px; right: -20px;
          background: #ff6600; color: #000; padding: 20px;
          font-weight: 900; border-radius: 12px; transform: rotate(-5deg);
        }

        /* Vision List */
        .vision-list { list-style: none; padding: 0; margin-top: 30px; }
        .vision-list li { margin-bottom: 15px; font-weight: 600; color: #eee; }

        /* Stats */
        .stats-section { background: #0a0a0a; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; }
        .stat-card { text-align: center; padding: 30px; }
        .stat-icon { font-size: 30px; color: #444; margin-bottom: 15px; }
        .stat-value { font-size: 2.5rem; font-weight: 900; color: #ff6600; }
        .stat-label { color: #666; font-size: 12px; font-weight: 700; text-transform: uppercase; }

        /* Bento Grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .bento-item {
          background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 20px;
          transition: 0.3s;
        }
        .bento-item.highlight { border-color: #ff6600; background: #ff660005; }
        .bento-item h4 { font-weight: 800; color: #fff; margin-bottom: 15px; }
        .bento-item p { color: #666; font-size: 14px; margin: 0; }
        .bento-item:hover { border-color: #ff6600; transform: scale(1.02); }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .bento-grid { grid-template-columns: 1fr; }
          .about-hero { height: 50vh; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;