import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(3); // đếm ngược 3 giây

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div
        className="p-4 shadow-sm rounded-4 text-center"
        style={{ maxWidth: "480px", width: "100%", background: "#fff" }}
      >
        {/* Animation */}
        <div className="success-icon mb-3">
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 16-16"
            />
          </svg>
        </div>

        <h3 className="fw-bold text-success mb-2">Đặt hàng thành công!</h3>
        <p className="text-muted mb-3">
          Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.  
          <br />Tự động chuyển về trang chủ sau <b>{count}</b> giây...
        </p>

        {/* Nút tiếp tục mua sắm */}
        <Link
          to="/"
          className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* CSS */}
      <style>{`
        .success-animation .checkmark {
          width: 80px;
          height: 80px;
          display: inline-block;
          border-radius: 50%;
          position: relative;
        }

        .success-icon {
  width: 90px;
  height: 90px;
  display: inline-block;
}

.checkmark-svg {
  width: 100%;
  height: 100%;
  stroke: #4caf50;
  stroke-width: 4;
  stroke-linecap: round;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s ease-out forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.4s 0.6s ease-out forwards;
}

@keyframes stroke {
  to { stroke-dashoffset: 0; }
}
      `}</style>
    </div>
  );
};

export default OrderSuccess;
