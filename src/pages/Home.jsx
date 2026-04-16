import React, { useEffect, useState } from "react";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import HighlightSection from "../components/HighlightSection";
import SupportSection from "../components/SupportSection";
import { getHotProducts, getFeaturedProducts, getAllProducts } from "../api/productApi";

const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  viewport: { once: true, margin: "-50px" }
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
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#050505" }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* Progress Bar */}
      <motion.div className="progress-bar-top" style={{ scaleX }} />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Marquee Section - Tối ưu cho cả Mobile */}
      <div className="marquee-container">
        <motion.div 
          className="marquee-content"
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {[1, 2, 3].map((i) => (
            <span key={i}>
              FREE SHIPPING OVER 5M • AUTHENTIC SOUND • TDC AUDIO PREMIUM • 24/7 SUPPORT • &nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      <Container className="py-4 py-md-5">
        {/* 3. Highlight Sections */}
        <motion.div {...fadeInUp}>
          <HighlightSection title="SẢN PHẨM HOT" products={productsHot} />
        </motion.div>

        <motion.div {...fadeInUp} className="mt-5">
          <HighlightSection title="SẢN PHẨM SALE" products={productsSale} />
        </motion.div>

        {/* 4. All Products Grid */}
        <section className="all-products-section mt-5 pt-4 pt-md-5">
          <div className="section-header text-center mb-4 mb-md-5">
            <Badge className="discover-badge mb-2">DISCOVER</Badge>
            <h2 className="section-title">TẤT CẢ SẢN PHẨM</h2>
            <div className="title-underline"></div>
          </div>

          <Row className="g-3 g-md-4">
            {products.map((product, idx) => (
              <Col key={product.id} xs={6} md={4} lg={3}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.1 }}
                >
                  <ProductCard item={product} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* 5. Support Section */}
      <div className="support-wrapper">
        <Container>
          <SupportSection />
        </Container>
      </div>

      <style>{`
        .home-wrapper {
          background: #050505;
          color: #fff;
          overflow-x: hidden;
        }

        .progress-bar-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #ff6600;
          z-index: 10000;
          origin-x: 0;
        }

        /* Marquee */
        .marquee-container {
          background: #ff6600;
          color: #000;
          padding: 8px 0;
          font-weight: 900;
          overflow: hidden;
          white-space: nowrap;
          border-y: 1px solid rgba(0,0,0,0.1);
        }
        .marquee-content {
          display: inline-block;
          font-size: clamp(0.8rem, 2vw, 1.1rem);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Section Header */
        .section-title {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -1px;
        }
        .discover-badge {
          background: rgba(255, 102, 0, 0.15) !important;
          color: #ff6600 !important;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 6px 12px;
        }
        .title-underline {
          width: 50px;
          height: 3px;
          background: #ff6600;
          margin: 15px auto;
        }

        /* Support Section */
        .support-wrapper {
          background: #0a0a0a;
          border-top: 1px solid #1a1a1a;
          margin-top: 50px;
          padding: 40px 0;
        }

        /* Mobile Optimization */
        @media (max-width: 767.98px) {
          .py-5 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .g-3 { --bs-gutter-x: 0.75rem; --bs-gutter-y: 0.75rem; }
          
          /* Giảm bớt animation cho mobile để mượt hơn */
          .progress-bar-top { height: 2px; }
        }

        /* Khắc phục lỗi hiển thị ngang trên Mobile */
        body { overflow-x: hidden; width: 100%; }
      `}</style>
    </div>
  );
};

export default Home;