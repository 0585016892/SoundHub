import React, { useState } from "react";
import { Card, Placeholder, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaCartPlus } from "react-icons/fa";

const ProductCard = ({ item }) => {
  const API_URL = "http://localhost:20032";
  const [isLoaded, setIsLoaded] = useState(false);

  if (!item) return null;

  const imageUrl = `${API_URL}/uploads/products/${item.image}`;
  const formattedPrice = Number(item.price).toLocaleString("vi-VN");

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="product-card-wrapper"
    >
      <Card className="luxury-product-card">
        {/* IMAGE BOX */}
        <div className="image-container">
          {!isLoaded && (
            <Placeholder as="div" animation="glow" className="image-skeleton" />
          )}
          
          <img
            src={imageUrl}
            alt={item.name}
            className={`product-img ${isLoaded ? "loaded" : "loading"}`}
            onLoad={() => setIsLoaded(true)}
          />

          {/* OVERLAY KHI HOVER */}
          <div className="product-overlay">
            <Link to={`/san-pham/${item.slug}`} className="btn-action view">
              <FaEye />
            </Link>
            <button className="btn-action add-cart">
              <FaCartPlus />
            </button>
          </div>

          {/* BADGE (Nếu có sale hoặc new) */}
          {item.isNew && <Badge className="status-badge">NEW</Badge>}
        </div>

        {/* CONTENT BOX */}
        <Card.Body className="p-3">
          {!isLoaded ? (
            <>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
            </>
          ) : (
            <>
              <div className="brand-tag">SOUNDHUB EXCLUSIVE</div>
              <Card.Title className="product-name">
                <Link to={`/san-pham/${item.slug}`}>{item.name}</Link>
              </Card.Title>
              
              <div className="price-tag">
                <span className="currency">₫</span>
                <span className="amount">{formattedPrice}</span>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .product-card-wrapper {
          position: relative;
          height: 100%;
        }

        .luxury-product-card {
          background: #0f0f0f !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 20px !important;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .luxury-product-card:hover {
          border-color: rgba(255, 102, 0, 0.3) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 102, 0, 0.05);
        }

        /* Image Container */
        .image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #151515;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .luxury-product-card:hover .product-img {
          transform: scale(1.1);
        }

        .image-skeleton {
          width: 100%;
          height: 100%;
          background: #1a1a1a;
        }

        /* Hover Overlay */
        .product-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          opacity: 0;
          transition: 0.3s ease;
        }

        .luxury-product-card:hover .product-overlay {
          opacity: 1;
        }

        .btn-action {
          width: 45px; height: 45px;
          border-radius: 50%;
          border: none;
          background: #fff;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          text-decoration: none;
        }

        .btn-action:hover {
          background: #ff6600;
          color: #fff;
          transform: translateY(-5px);
        }

        /* Content Styling */
        .brand-tag {
          font-size: 10px;
          font-weight: 800;
          color: #ff6600;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .product-name a {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          transition: 0.3s;
        }

        .product-name a:hover {
          color: #ff6600;
        }

        .price-tag {
          margin-top: 15px;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .currency {
          font-size: 14px;
          color: #ff6600;
          font-weight: 700;
        }

        .amount {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .status-badge {
          position: absolute;
          top: 15px; left: 15px;
          background: #ff6600 !important;
          font-weight: 900;
          font-size: 10px;
          padding: 5px 10px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .image-container { height: 180px; }
          .amount { font-size: 1.1rem; }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;