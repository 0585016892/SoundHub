import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from "react-icons/hi2";

const HighlightSection = ({ title, products }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="luxury-highlight py-5">
      <div className="container-fluid px-md-5">
        {/* HEADER AREA */}
        <div className="d-flex align-items-end justify-content-between mb-5">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="luxury-badge">PREMIUM SELECTION</div>
            <h2 className="luxury-section-title mt-2">
              {title} <span className="accent">.</span>
            </h2>
          </motion.div>

          <div className="d-none d-md-flex align-items-center gap-4">
            <div className="scroll-hint text-secondary">SCROLL TO EXPLORE</div>
            <div className="nav-group">
              <button onClick={() => scroll("left")} className="luxury-nav-btn">
                <HiOutlineArrowLongLeft size={24} />
              </button>
              <button onClick={() => scroll("right")} className="luxury-nav-btn">
                <HiOutlineArrowLongRight size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* CAROUSEL BODY */}
        <div
          ref={carouselRef}
          className="luxury-carousel-container hide-scrollbar"
        >
          {products.map((product, index) => (
            <motion.div 
              key={product.id} 
              className="luxury-item-wrapper"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Số thứ tự nghệ thuật phía sau card */}
              <div className="item-index-bg">{(index + 1).toString().padStart(2, '0')}</div>
              <div className="card-inner">
                <ProductCard item={product} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .luxury-highlight {
          background: #050505;
          position: relative;
          padding: 80px 0;
          overflow: hidden;
        }

        .luxury-badge {
          color: #ff6600;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          border-left: 3px solid #ff6600;
          padding-left: 15px;
        }

        .luxury-section-title {
          color: #fff;
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -2px;
          margin: 0;
        }

        .accent { color: #ff6600; }

        .scroll-hint {
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 600;
        }

        /* Navigation Style */
        .nav-group { display: flex; gap: 10px; }
        .luxury-nav-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .luxury-nav-btn:hover {
          background: #ff6600;
          border-color: #ff6600;
          box-shadow: 0 10px 20px rgba(255,102,0,0.3);
          transform: translateY(-5px);
        }

        /* Carousel Layout */
        .luxury-carousel-container {
          display: flex;
          gap: 4rem;
          overflow-x: auto;
          padding: 40px 10px;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }

        .luxury-item-wrapper {
          flex: 0 0 auto;
          width: 300px;
          position: relative;
          scroll-snap-align: center;
        }

        /* Watermark Index */
        .item-index-bg {
          position: absolute;
          top: -40px;
          left: -20px;
          font-size: 120px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.03);
          z-index: 0;
          user-select: none;
          font-family: 'Arial Black', sans-serif;
        }

        .card-inner {
          position: relative;
          z-index: 1;
          transition: 0.5s;
        }

        .luxury-item-wrapper:hover .card-inner {
          transform: translateY(-15px);
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 768px) {
          .luxury-section-title { font-size: 1.8rem; }
          .luxury-carousel-container { gap: 2rem; }
          .luxury-item-wrapper { width: 240px; }
          .item-index-bg { font-size: 80px; top: -20px; }
        }
      `}</style>
    </section>
  );
};

export default HighlightSection;