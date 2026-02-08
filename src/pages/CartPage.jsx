import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Image,
  InputNumber,
  Divider,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCartOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined, 
  SafetyCertificateOutlined,
  TruckOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;
const IMAGE_URL = "http://localhost:20032/uploads/products/";

const CartPage = () => {
  const { cart, updateQty, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedItems(checked ? cart.map((i) => i.variant_id) : []);
  };

  const handleRemove = (variant_id, product_id) => {
    Swal.fire({
      title: "Xóa khỏi giỏ hàng?",
      text: "Bạn chắc chắn muốn bỏ sản phẩm này?",
      icon: "warning",
      background: "#1a1a1a",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#ff6600",
      cancelButtonColor: "#333",
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) removeFromCart(variant_id, product_id);
    });
  };

  // UI KHI GIỎ TRỐNG
// EMPTY CART UI - PHIÊN BẢN LUXURY DARK
  if (!cart.length)
    return (
      <div className="cart-empty-luxury">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="empty-content"
        >
          {/* Icon âm thanh cách điệu thay vì icon cart đơn thuần */}
          <div className="icon-box">
            <div className="pulse-ring"></div>
            <ShoppingCartOutlined className="main-icon" />
          </div>

          <h2 className="empty-title">ÂM THANH ĐANG CHỜ ĐỢI...</h2>
          <p className="empty-subtitle">
            Giỏ hàng của bạn hiện đang trống. Đừng bỏ lỡ những giai điệu tuyệt vời đang chờ bạn khám phá.
          </p>

          <Link to="/san-pham">
            <button className="btn-explore">
              <span className="btn-text">QUAY LẠI CỬA HÀNG</span>
              <div className="btn-glow"></div>
            </button>
          </Link>
        </motion.div>

        <style jsx>{`
          .cart-empty-luxury {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #050505; /* Đen sâu đồng bộ với Header/Footer */
            padding: 20px;
          }

          .empty-content {
            text-align: center;
            max-width: 600px;
          }

          /* Hiệu ứng Icon phát sáng */
          .icon-box {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .main-icon {
            font-size: 60px;
            color: #ff6600;
            z-index: 2;
          }

          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid #ff6600;
            border-radius: 50%;
            animation: pulse 2s infinite;
            opacity: 0;
          }

          @keyframes pulse {
            0% { transform: scale(0.5); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
          }

          .empty-title {
            color: #fff;
            font-weight: 900;
            letter-spacing: 4px;
            font-size: 1.8rem;
            margin-bottom: 15px;
          }

          .empty-subtitle {
            color: #888;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 40px;
          }

          /* Nút bấm Cinematic */
          .btn-explore {
            position: relative;
            background: transparent;
            border: 1px solid #ff6600;
            color: #fff;
            padding: 15px 40px;
            font-weight: 800;
            letter-spacing: 2px;
            cursor: pointer;
            overflow: hidden;
            transition: 0.4s;
          }

          .btn-text { position: relative; z-index: 2; }

          .btn-glow {
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,102,0,0.4), transparent);
            transition: 0.5s;
          }

          .btn-explore:hover {
            background: #ff6600;
            box-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
          }

          .btn-explore:hover .btn-glow {
            left: 100%;
          }
        `}</style>
      </div>
    );

  return (
    <div className="cart-page-wrapper mt-5">
      <Container fluid="xl" className="py-5">
        <div className="d-flex align-items-center mb-5 gap-3">
            <Link to="/san-pham" className="back-link">
                <ArrowLeftOutlined /> Tiếp tục mua sắm
            </Link>
            <h1 className="cart-title mb-0">GIỎ HÀNG <span className="accent">({cart.length})</span></h1>
        </div>

        <Row gutter={[32, 32]}>
          {/* PHẦN DANH SÁCH SẢN PHẨM */}
          <Col lg={16}>
            <div className="cart-list-header d-flex justify-content-between align-items-center p-3">
                <Checkbox 
                    className="custom-checkbox"
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                >
                    <span className="text-white fw-bold">CHỌN TẤT CẢ</span>
                </Checkbox>
                <Text className="text-secondary small">Giá sản phẩm</Text>
            </div>

            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.variant_id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="cart-item-card mb-3"
                >
                  <div className="d-flex align-items-center gap-3 p-3">
                    <Checkbox 
                        className="custom-checkbox"
                        checked={selectedItems.includes(item.variant_id)}
                        onChange={() => toggleSelect(item.variant_id)}
                    />
                    
                    <div className="item-image-wrapper">
                        <Image
                            src={IMAGE_URL + item.image}
                            preview={false}
                            className="rounded-3"
                        />
                    </div>

                    <div className="item-info flex-grow-1">
                        <h5 className="text-white mb-1">{item.product_name}</h5>
                        <Text className="text-dim small d-block mb-2">
                            Màu sắc: {item.color} | Công suất: {item.power}
                        </Text>
                        <div className="qty-control mt-3">
                            <button className="qty-btn" onClick={() => updateQty(item.variant_id, item.product_id, item.quantity - 1)}>-</button>
                            <span className="qty-value">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.variant_id, item.product_id, item.quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className="item-price-area text-end">
                        <div className="price-tag mb-4">{item.price.toLocaleString()} đ</div>
                        <Button 
                            type="text" 
                            className="delete-btn" 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleRemove(item.variant_id, item.product_id)}
                        />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </Col>

          {/* PHẦN THANH TOÁN */}
          <Col lg={8}>
            <div className="order-summary-card p-4">
                <Title level={4} className="text-white mb-4">TÓM TẮT ĐƠN HÀNG</Title>
                
                <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{total.toLocaleString()} đ</span>
                </div>

                <div className="summary-row">
                    <span>Vận chuyển</span>
                    <span className={total >= 500000 ? "text-success" : "text-white"}>
                        {total >= 500000 ? "MIỄN PHÍ" : "30,000 đ"}
                    </span>
                </div>

                <Divider className="bg-secondary opacity-25" />

                <div className="summary-row total">
                    <span>TỔNG CỘNG</span>
                    <span className="accent fs-4 fw-black">
                        {(total >= 500000 ? total : total + 30000).toLocaleString()} đ
                    </span>
                </div>

                <Link to="/checkout">
                    <Button className="btn-checkout w-100 mt-4" size="large">
                        TIẾN HÀNH THANH TOÁN
                    </Button>
                </Link>

                <div className="cart-features mt-4">
                    <div className="feature-item"><TruckOutlined className="accent" /> Giao hàng nhanh 2H (Nội thành)</div>
                    <div className="feature-item"><SafetyCertificateOutlined className="accent" /> Bảo hành 12 tháng chính hãng</div>
                </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .cart-page-wrapper {
            background: #050505;
            min-height: 100vh;
            color: #fff;
            font-family: 'Inter', sans-serif;
        }
        .accent { color: #ff6600 !important; }
        .cart-title { font-weight: 900; letter-spacing: -1px; color: #fff; }
        
        .back-link { 
            color: #888; text-decoration: none; font-size: 14px; transition: 0.3s;
        }
        .back-link:hover { color: #ff6600; }

        /* Empty Cart */
        .cart-empty-container {
            height: 70vh; display: flex; align-items: center; justify-content: center; background: #050505;
        }
        .empty-card { text-align: center; }
        .empty-icon-wrapper {
            width: 120px; height: 120px; background: #111; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; margin: 0 auto;
            border: 1px dashed #333;
        }
        .empty-icon { font-size: 50px; color: #333; }

        /* Cart Items */
        .cart-list-header { border-bottom: 1px solid #1a1a1a; }
        .cart-item-card {
            background: #0a0a0a;
            border: 1px solid #1a1a1a;
            border-radius: 12px;
            transition: 0.3s;
        }
        .cart-item-card:hover { border-color: #333; transform: translateY(-2px); }
        .item-image-wrapper { width: 100px; height: 100px; overflow: hidden; border-radius: 8px; }
        .item-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .text-dim { color: #666; }

        /* Qty Control */
        .qty-control {
            display: inline-flex; align-items: center; background: #1a1a1a; border-radius: 6px; padding: 4px;
        }
        .qty-btn {
            background: none; border: none; color: #fff; width: 30px; height: 30px;
            cursor: pointer; font-size: 18px; transition: 0.2s;
        }
        .qty-btn:hover { color: #ff6600; }
        .qty-value { padding: 0 15px; font-weight: bold; min-width: 40px; text-align: center; }

        .price-tag { color: #ff6600; font-weight: 800; font-size: 1.1rem; }
        .delete-btn { color: #444 !important; transition: 0.3s; }
        .delete-btn:hover { color: #ff4d4f !important; transform: scale(1.2); }

        /* Order Summary */
        .order-summary-card {
            background: #0a0a0a; border: 1px solid #ff660040; border-radius: 16px; position: sticky; top: 100px;
        }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; color: #888; font-size: 15px; }
        .summary-row.total { color: #fff; font-weight: 800; }

        .btn-checkout {
            background: #ff6600 !important; border: none !important; color: #fff !important;
            font-weight: 900 !important; letter-spacing: 1px; height: 55px !important; border-radius: 12px !important;
            box-shadow: 0 10px 20px rgba(255, 102, 0, 0.2) !important;
        }
        .btn-checkout:hover { background: #fff !important; color: #000 !important; }

        .btn-glow-accent {
            background: #ff6600; border: none; color: #fff; font-weight: 800; padding: 10px 40px;
            border-radius: 50px; box-shadow: 0 0 20px rgba(255, 102, 0, 0.4);
        }

        .cart-features { background: #111; padding: 15px; border-radius: 8px; }
        .feature-item { font-size: 12px; color: #888; margin-bottom: 8px; display: flex; gap: 10px; }

        /* Ant Custom Checkbox */
        .custom-checkbox .ant-checkbox-inner { background: transparent; border-color: #333; }
        .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner { background: #ff6600; border-color: #ff6600; }
      `}</style>
    </div>
  );
};

// Container helper
const Container = ({ children, className, fluid }) => (
  <div className={`container${fluid ? "-fluid" : ""} ${className}`}>{children}</div>
);

export default CartPage;