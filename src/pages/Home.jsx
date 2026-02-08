import React, { useEffect, useState } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import HighlightSection from "../components/HighlightSection";
import SupportSection from "../components/SupportSection";
import { getHotProducts, getFeaturedProducts, getAllProducts } from "../api/productApi";

// Animation variants cho Framer Motion
const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [productsHot, setProductsHot] = useState([]);
  const [productsSale, setProductsSale] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [all, hot, sale] = await Promise.all([
          getAllProducts(),
          getHotProducts(),
          getFeaturedProducts()
        ]);
        setProducts(all || []);
        setProductsHot(hot || []);
        setProductsSale(sale || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-wrapper" style={{ background: "#050505", color: "#fff", overflowX: "hidden" }}>
      {/* Progress Bar ở trên cùng */}
      <motion.div className="progress-bar" style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: 4, background: '#ff6600', zIndex: 9999, originX: 0 }} />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Banner Chạy Chữ (Marquee) - Tạo cảm giác hiện đại */}
      <div className="marquee-section" style={{ background: "#ff6600", color: "#000", padding: "10px 0", fontWeight: "bold", overflow: "hidden", whiteSpace: "nowrap" }}>
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}
        >
          FREE SHIPPING ON ORDERS OVER 5M — AUTHENTIC SOUND — SOUNDHUB PREMIUM — 24/7 SUPPORT — 
          FREE SHIPPING ON ORDERS OVER 5M — AUTHENTIC SOUND — SOUNDHUB PREMIUM — 24/7 SUPPORT — 
        </motion.div>
      </div>

      <Container className="py-5">
        {/* 3. Highlight Sections (Hot & Sale) */}
        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp}>
          <HighlightSection title="SẢN PHẨM HOT" products={productsHot} />
        </motion.div>

        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeInUp} className="mt-5">
          <HighlightSection title="SẢN PHẨM SALE" products={productsSale} />
        </motion.div>

        {/* 4. Tất cả sản phẩm với Grid chuyên nghiệp */}
        <section className="all-products-section mt-5 pt-5">
          <div className="section-header text-center mb-5">
            <Badge bg="secondary" className="mb-2" style={{ background: '#ff660020', color: '#ff6600' }}>DISCOVER</Badge>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>TẤT CẢ SẢN PHẨM</h2>
            <div style={{ width: 60, height: 4, background: '#ff6600', margin: '20px auto' }}></div>
          </div>

          <Row className="g-4">
            {products.map((product, idx) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard item={product} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* 5. Support Section với nền tối giản */}
      <div style={{ background: "#0a0a0a", borderTop: "1px solid #222" }}>
        <Container>
          <SupportSection />
        </Container>
      </div>

      {/* CSS Inline cho các hiệu ứng đặc biệt */}
      <style>{`
        .home-wrapper {
          scroll-behavior: smooth;
        }
        .section-header h2 {
          text-transform: uppercase;
        }
        /* Custom Hover cho Product Cards trong grid */
        .carousel-card:hover {
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }
        /* Hiệu ứng mờ nền cho Container */
        .container {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default Home;