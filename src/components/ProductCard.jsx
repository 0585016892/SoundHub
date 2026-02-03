import React, { useState } from "react";
import { Card, Button, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  const API_URL = "http://localhost:20032";
  const [loading, setLoading] = useState(true);

  if (!item) return null;

  const imageUrl = `${API_URL}/uploads/products/${item.image}`;
  const price = Number(item.price).toLocaleString("vi-VN");

  return (
    <Card
      className="shadow-sm border-0 rounded-4 mb-4 product-card"
      style={{ overflow: "hidden" }}
    >
      {/* IMAGE */}
      {loading && (
        <Placeholder as={Card.Img} animation="wave" style={{ height: "220px" }} />
      )}

      <Card.Img
        variant="top"
        src={imageUrl}
        height="220"
        style={{ 
          objectFit: "cover",
          display: loading ? "none" : "block",
        }}
        onLoad={() => setLoading(false)}
      />

      {/* BODY */}
      <Card.Body>
        {loading ? (
          <>
            <Placeholder as={Card.Title} animation="wave">
              <Placeholder xs={8} />
            </Placeholder>

            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={4} />
            </Placeholder>

            <Placeholder.Button variant="dark" xs={6} />
          </>
        ) : (
          <>
            <Card.Title
              className="fw-bold text-truncate"
              style={{ fontSize: "0.95rem" }}
            >
              {item.name}
            </Card.Title>

            <Card.Text className="text-danger fw-bold fs-5 mb-3">
              {price} đ
            </Card.Text>

            <Button
              as={Link}
              to={`/san-pham/${item.slug}`}
              variant="dark"
              className="w-100 rounded-3"
            >
              Xem chi tiết
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
