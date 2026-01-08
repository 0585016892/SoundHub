import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";

const HighlightSection = ({ title, products }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <section className="py-5 bg-light position-relative">
        <div className="top10-banner text-white fw-bold d-flex align-items-center px-3 ">
            <h1 className="top10-text">TOP 10</h1>
            <h1 className="ms-2">{title}</h1>
        </div>

      <div
        ref={carouselRef}
        className="d-flex overflow-auto hide-scrollbar"

        style={{ gap: "1rem", padding: "1rem",backgroundColor:'#DF0506' }}
      >
        {products.map((product) => (
          <motion.div key={product.id} className="carousel-card">
            <ProductCard item={product} />
          </motion.div>
        ))}
      </div>

      {/* Nút điều khiển */}
      <button onClick={scrollLeft} className="btn btn-outline-light carousel-btn left-btn">
        <AiFillCaretLeft size={30} />
      </button>
      <button onClick={scrollRight} className="btn btn-outline-light carousel-btn right-btn">
        <AiFillCaretRight size={30} />
      </button>

      <style jsx>{`
       .top10-banner {
          background-color: #d30000;
            font-size: 1.2rem;
            padding: 0.5rem 1rem;
            border-top-left-radius: 8px;   /* bo tròn góc trên trái */
            border-top-right-radius: 8px;  /* bo tròn góc trên phải */
            border-bottom-left-radius: 0;  /* không bo dưới trái */
            border-bottom-right-radius: 0; /* không bo dưới phải */
            color: #fff;
        }
        .top10-text {
          color: gold;
        }
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }
        .carousel-card {
          width: 200px;
          flex: 0 0 auto;
        }
           .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background-color: rgba(0, 0, 0, 0.5);
          border: 5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 80px;
          color: white;
          transition: background-color 0.2s ease;
          padding:0;
        }
        .carousel-btn:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .left-btn {
          left: 12px;
        }
        .right-btn {
          right: 12px;
        }
      `}</style>
    </section>
  );
};

export default HighlightSection;
