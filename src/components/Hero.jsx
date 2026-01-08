import React from "react";
import { Carousel, Button, Container } from "react-bootstrap";

const HeroSlider = () => {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80",
      title: "Âm Thanh Đỉnh Cao",
      desc: "Trải nghiệm âm nhạc chân thực với các dòng loa cao cấp.",
      btn: "Khám phá ngay",
    },
    {
      image:
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1600&q=80",
      title: "Loa Bluetooth Thời Thượng",
      desc: "Thiết kế hiện đại – pin khủng – âm thanh mạnh mẽ.",
      btn: "Xem sản phẩm",
    },
    {
      image:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1600&q=80",
      title: "Dàn Karaoke Gia Đình",
      desc: "Giải trí cực đã – hát hay hơn với bộ dàn chuyên nghiệp.",
      btn: "Mua ngay",
    },
  ];

  return (
    <Carousel fade interval={3000}>
      {slides.map((s, index) => (
        <Carousel.Item key={index}>
          {/* Background image */}
          <div
            style={{
              backgroundImage: `url(${s.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "480px",
              position: "relative",
            }}
          >
            {/* Overlay mờ cho dễ đọc chữ */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
            />

            <Container
              className="h-100 d-flex flex-column justify-content-center text-white"
              style={{ position: "relative", zIndex: 10 }}
            >
              <h1 className="fw-bold display-4">{s.title}</h1>
              <p className="fs-5 mb-4">{s.desc}</p>
              <Button variant="warning" size="lg">
                {s.btn}
              </Button>
            </Container>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroSlider;
