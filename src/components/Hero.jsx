import React from "react";
import { Carousel, Button, Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlider = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1600&q=80",
      tag: "PREMIUM SOUND",
      title: "ĐÁNH THỨC \n GIÁC QUAN",
      desc: "Hệ thống âm thanh Hi-End tái tạo âm trường trung thực đến từng nốt nhạc.",
      btn: "TRẢI NGHIỆM NGAY",
    },
    {
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1600&q=80",
      tag: "WIRELESS FREEDOM",
      title: "TỰ DO \n KHÔNG DÂY",
      desc: "Công nghệ Bluetooth 5.3 mới nhất, kết nối liền mạch - âm thanh không nén.",
      btn: "KHÁM PHÁ BỘ SƯU TẬP",
    },
    {
      image: "https://images.unsplash.com/photo-1524367080943-e60faa402b97?auto=format&fit=crop&w=1600&q=80",
      tag: "ICONIC DESIGN",
      title: "THIẾT KẾ \n VƯỢT THỜI GIAN",
      desc: "Vẻ đẹp cổ điển hòa quyện cùng công suất mạnh mẽ cho không gian nội thất.",
      btn: "MUA NGAY",
    },
  ];

  return (
    <section className="hero-slider-wrapper">
      <Carousel fade interval={5000} indicators={true} controls={false} pause={false}>
        {slides.map((s, index) => (
          <Carousel.Item key={index}>
            <div className="hero-slide-content">
              {/* Background với hiệu ứng Ken Burns (Zoom nhẹ) */}
              <div
                className="hero-bg-zoom"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              
              {/* Lớp phủ Gradient đen sâu */}
              <div className="hero-overlay" />

              <Container className="h-100 d-flex align-items-center">
                <div className="hero-text-container">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-tag"
                  >
                    {s.tag}
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-title"
                  >
                    {s.title.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line} <br />
                      </React.Fragment>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="hero-desc"
                  >
                    {s.desc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button className="btn-hero-glow">
                      {s.btn}
                    </Button>
                  </motion.div>
                </div>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .hero-slider-wrapper {
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .hero-slide-content {
          height: 85vh; /* Chiều cao hiện đại, không quá ngắn cũng không quá dài */
          position: relative;
          overflow: hidden;
        }

        /* Hiệu ứng Zoom hình nền */
        .hero-bg-zoom {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          animation: kenburns 20s infinite alternate;
          z-index: 1;
        }

        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
          z-index: 2;
        }

        .hero-text-container {
          position: relative;
          z-index: 10;
          max-width: 700px;
        }

        .hero-tag {
          color: #ff6600;
          letter-spacing: 5px;
          font-weight: 700;
          font-size: 14px;
          display: block;
          margin-bottom: 15px;
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 900;
          color: #fff;
          line-height: 0.9;
          margin-bottom: 25px;
          letter-spacing: -2px;
        }

        .hero-desc {
          color: #ccc;
          font-size: 1.1rem;
          max-width: 500px;
          margin-bottom: 35px;
          border-left: 3px solid #ff6600;
          padding-left: 20px;
        }

        .btn-hero-glow {
          background: #ff6600 !important;
          border: none !important;
          padding: 15px 40px !important;
          font-weight: 800 !important;
          font-size: 14px !important;
          letter-spacing: 1px !important;
          color: #fff !important;
          transition: 0.4s !important;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);
        }

        .btn-hero-glow:hover {
          background: #fff !important;
          color: #000 !important;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          transform: translateY(-5px);
        }

        /* Custom Indicators */
        .carousel-indicators [data-bs-target] {
          width: 40px;
          height: 4px;
          background-color: #ff6600;
          border-radius: 2px;
          opacity: 0.3;
        }
        .carousel-indicators .active { opacity: 1; }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero-slide-content { height: 70vh; }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;