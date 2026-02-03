import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Image,
} from "antd";
import { motion } from "framer-motion";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const IMAGE_URL = "http://localhost:20032/uploads/products/";

const CartPage = () => {
  const { cart, updateQty, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const isAllSelected = selectedItems.length === cart.length;

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    setSelectedItems(checked ? cart.map((i) => i.variant_id) : []);
  };

  const handleRemoveSelected = () => {
    if (!selectedItems.length) {
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

  // EMPTY CART UI
  if (!cart.length)
    return (
      <motion.div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card style={{ textAlign: "center", padding: 40, maxWidth: 500 }}>
          <ShoppingCartOutlined style={{ fontSize: 60, color: "red" }} />
          <Title level={4} style={{ marginTop: 20 }}>
            Giỏ hàng trống
          </Title>
          <Text type="secondary">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Text>
          <br />
          <Link to="/san-pham">
            <Button
              type="primary"
              size="large"
              style={{
                marginTop: 20,
                borderRadius: 50,
                background: "linear-gradient(90deg,#ff416c,#ff4b2b)",
              }}
            >
              Mua sắm ngay
            </Button>
          </Link>
        </Card>
      </motion.div>
    );

  // TABLE COLUMNS
  const columns = [
    {
      title: "",
      dataIndex: "variant_id",
      render: (id) => (
        <Checkbox
          checked={selectedItems.includes(id)}
          onChange={() => toggleSelect(id)}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "image",
      render: (img) => (
        <Image
          src={IMAGE_URL + img}
          width={70}
          height={70}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Thông tin",
      render: (_, item) => (
        <>
          <b>{item.product_name}</b>
          <br />
          <Text type="secondary">
            Màu: {item.color} | Công suất: {item.power}
          </Text>
        </>
      ),
    },
    {
      title: "Số lượng",
      render: (_, item) => (
        <Space>
          <Button
            size="small"
            onClick={() =>
              updateQty(item.variant_id, item.product_id, item.quantity - 1)
            }
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <b>{item.quantity}</b>
          <Button
            size="small"
            onClick={() =>
              updateQty(item.variant_id, item.product_id, item.quantity + 1)
            }
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: "Giá",
      render: (_, item) => (
        <Text strong style={{ color: "red" }}>
          {item.price.toLocaleString()} đ
        </Text>
      ),
    },
    {
      title: "Hành động",
      render: (_, item) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleRemove(item.variant_id, item.product_id)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 1300, margin: "auto" }}>
      <Title level={3}>🛒 Giỏ hàng</Title>

      {/* TOP BAR */}
      <Row
        justify="space-between"
        align="middle"
        style={{
          background: "#fff",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
          boxShadow: "0 2px 6px rgba(0,0,0,.05)",
        }}
      >
        <Checkbox
          checked={isAllSelected}
          onChange={(e) => toggleSelectAll(e.target.checked)}
        >
          Chọn tất cả ({cart.length})
        </Checkbox>

        <Button
          danger
          disabled={!selectedItems.length}
          onClick={handleRemoveSelected}
        >
          Xóa mục đã chọn
        </Button>
      </Row>

      <Row gutter={16}>
        {/* LEFT TABLE */}
        <Col lg={16}>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey="variant_id"
            pagination={false}
            bordered
          />
        </Col>

        {/* RIGHT SUMMARY */}
        <Col lg={8}>
          <Card
            title="Tổng đơn hàng"
            style={{
              position: "sticky",
              top: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,.1)",
            }}
          >
            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Text>Tạm tính</Text>
              <Text strong>{total.toLocaleString()} đ</Text>
            </Row>

            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Text>Vận chuyển</Text>
              {total >= 200000 ? (
                <Text style={{ color: "green" }}>Miễn phí</Text>
              ) : (
                <Text style={{ color: "red" }}>30,000 đ</Text>
              )}
            </Row>

            <hr />

            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Text>Tổng thanh toán</Text>
              <Title level={4} style={{ color: "red", margin: 0 }}>
                {(total >= 200000 ? total : total + 30000).toLocaleString()} đ
              </Title>
            </Row>

            <Link to="/checkout">
              <Button type="primary" danger block size="large">
                Đặt hàng
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
