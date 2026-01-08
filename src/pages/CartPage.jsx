import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
const IMAGE_URL = "http://localhost:5000/uploads/products/";

const CartPage = () => {
  const { cart, updateQty, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const isAllSelected = selectedItems.length === cart.length;

  const toggleSelect = (id) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    setSelectedItems(isAllSelected ? [] : cart.map((i) => i.variant_id));
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      Swal.fire("Thông báo", "Bạn chưa chọn sản phẩm nào!", "info");
      return;
    }
    Swal.fire({
      title: "Xóa các sản phẩm đã chọn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (!res.isConfirmed) return;
      selectedItems.forEach((id) => {
        const item = cart.find((i) => i.variant_id === id);
        if (item) removeFromCart(item.variant_id, item.product_id);
      });
      setSelectedItems([]);
      Swal.fire("Đã xóa!", "Các sản phẩm đã được xóa.", "success");
    });
  };

  const handleRemove = (variant_id, product_id) => {
    Swal.fire({
      title: "Xóa sản phẩm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) removeFromCart(variant_id, product_id);
    });
  };

  if (cart.length === 0)
    return (
       <motion.div
          className="d-flex justify-content-center align-items-center py-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center p-5 shadow-lg border-0 rounded-4" style={{ maxWidth: "100%" }}>
            <div className="mb-3">
              <FaShoppingCart size={60} className="text-danger" />
            </div>
            <h4 className="fw-bold mb-3">Giỏ hàng trống </h4>
            <p className="text-muted mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy chọn ngay sản phẩm yêu thích!</p>
            <Link to="/san-pham">
              <Button
                className="px-4 py-2 fw-bold"
                style={{
                  background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                  border: "none",
                  borderRadius: "50px",
                  boxShadow: "0 4px 15px rgba(255,75,43,0.4)"
                }}
              >
                Mua sắm ngay
              </Button>
            </Link>
          </Card>
        </motion.div>
    );

  return (
    <div className="container my-4">
      <h3 className="fw-bold mb-4">Giỏ hàng</h3>

      {/* Top Bar */}
      <Row className="align-items-center mb-3 p-3 bg-white rounded shadow-sm">
        <Col xs="auto">
          <Form.Check 
            type="checkbox"
            label={`Chọn tất cả (${cart.length})`}
            checked={isAllSelected}
            onChange={toggleSelectAll}
          />
        </Col>
        <Col className="text-end">
          <Button 
            variant={selectedItems.length === 0 ? "secondary" : "danger"} 
            size="sm"
            disabled={selectedItems.length === 0}
            onClick={handleRemoveSelected}
          >
            Xóa mục đã chọn
          </Button>
        </Col>
      </Row>

      <Row>
        {/* LEFT: Cart Items */}
        <Col lg={8} className="mb-4">
          <Table bordered hover responsive className="bg-white rounded shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Thông tin</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item.variant_id}>
                  <td>
                    <Form.Check 
                      type="checkbox"
                      checked={selectedItems.includes(item.variant_id)}
                      onChange={() => toggleSelect(item.variant_id)}
                    />
                  </td>
                  <td>
                    <img 
                      src={IMAGE_URL + item.image} 
                      alt={item.product_name} 
                      className="rounded" 
                      style={{ width: 70, height: 70, objectFit: "cover" }} 
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{item.product_name}</div>
                    <div className="small text-muted">
                      Màu: {item.color} – Công suất: {item.power}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQty(item.variant_id, item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >-</Button>
                      <span className="px-2">{item.quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQty(item.variant_id, item.product_id, item.quantity + 1)}
                      >+</Button>
                    </div>
                  </td>
                  <td className="text-danger fw-bold">{item.price.toLocaleString()} đ</td>
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleRemove(item.variant_id, item.product_id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* RIGHT: Summary */}
        <Col lg={4}>
          <div className="bg-white rounded shadow-sm p-3 position-sticky" style={{ top: "100px" }}>
            <h5 className="fw-bold mb-3">Tổng đơn</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span className="fw-bold">{total.toLocaleString()} đ</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Vận chuyển</span>
              {total >= 200000 ? (
                <span className="text-success fw-bold">Miễn phí</span>
              ) : (
                <span className="text-danger fw-bold">30,000 đ</span>
              )}
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span>Tổng thanh toán</span>
              <span className="fw-bold text-danger fs-5">
                {(total >= 200000 ? total : total + 30000).toLocaleString()} đ
              </span>
            </div>
            <Link to="/checkout" className="btn btn-danger w-100">
              Đặt hàng
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
