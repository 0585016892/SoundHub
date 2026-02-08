import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingBag, FaHome } from "react-icons/fa";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5); // Tăng lên 5 giây để khách hàng kịp "tận hưởng" visual

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="order-success-wrapper">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="success-glass-card"
      >
        {/* ANIMATED CHECKMARK CONTAINER */}
        <div className="icon-box-neon">
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 16-16"
            />
          </svg>
          <div className="glow-effect"></div>
        </div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="success-title"
        >
          ORDER COMPLETED
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="success-message"
        >
          Giao dịch đã được xác nhận. <br />
          Chào mừng bạn đến với thế giới âm thanh đỉnh cao của <span>SoundHub</span>.
        </motion.p>

        <div className="countdown-bar-container">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="countdown-progress"
          ></motion.div>
          <span className="countdown-text">Redirecting in {count}s</span>
        </div>

        <div className="btn-group-success">
          <Link to="/profile/orders" className="btn-outline-neon">
            <FaShoppingBag className="me-2" /> ĐƠN HÀNG
          </Link>
          <Link to="/" className="btn-filled-neon">
            <FaHome className="me-2" /> TRANG CHỦ
          </Link>
        </div>
      </motion.div>

      <style>{`
        .order-success-wrapper {
          min-height: 100vh;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          position: relative;
        }

        /* Hiệu ứng hạt bụi bay lơ lửng phía sau (tùy chọn) */
        .order-success-wrapper::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: #ff6600;
          filter: blur(150px);
          opacity: 0.1;
          top: 20%; left: 10%;
        }

        .success-glass-card {
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 60px 40px;
          border-radius: 30px;
          text-align: center;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }

        /* Icon & Neon */
        .icon-box-neon {
          position: relative;
          width: 100px; height: 100px;
          margin: 0 auto 30px;
        }

        .checkmark-svg {
          width: 100%; height: 100%;
          stroke: #ff6600;
          stroke-width: 3;
          stroke-linecap: round;
          z-index: 2;
          position: relative;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: stroke 0.6s ease-out forwards;
        }

        .glow-effect {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 60px; height: 60px;
          background: #ff6600;
          filter: blur(40px);
          opacity: 0.4;
          animation: pulse-glow 2s infinite;
        }

        /* Typography */
        .success-title {
          color: #fff;
          font-weight: 900;
          letter-spacing: 5px;
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .success-message {
          color: #888;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .success-message span {
          color: #ff6600;
          font-weight: 700;
        }

        /* Progress Bar */
        .countdown-bar-container {
          position: relative;
          height: 30px;
          background: rgba(255,255,255,0.03);
          border-radius: 50px;
          margin-bottom: 40px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .countdown-progress {
          position: absolute;
          left: 0; top: 0; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 102, 0, 0.2));
        }

        .countdown-text {
          position: relative;
          z-index: 1;
          font-size: 11px;
          font-weight: 800;
          color: #444;
          letter-spacing: 1px;
        }

        /* Buttons */
        .btn-group-success {
          display: flex;
          gap: 15px;
        }

        .btn-outline-neon, .btn-filled-neon {
          flex: 1;
          padding: 14px;
          border-radius: 15px;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline-neon {
          border: 1px solid #222;
          color: #888;
        }

        .btn-outline-neon:hover {
          border-color: #ff6600;
          color: #ff6600;
        }

        .btn-filled-neon {
          background: #ff6600;
          color: #000;
        }

        .btn-filled-neon:hover {
          background: #fff;
          box-shadow: 0 10px 20px rgba(255,102,0,0.2);
        }

        @keyframes stroke { to { stroke-dashoffset: 0; } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;