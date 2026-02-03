import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getProductDetail } from "../api/productApi";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
const IMAGE_URL = "http://localhost:20032/uploads/products/";

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [qty, setQty] = useState(1);

  // ⭐ Load sản phẩm + thêm SP chính vào đầu danh sách
  useEffect(() => {
    (async () => {
      const data = await getProductDetail(slug);

      const mainVariant = {
        id: 0,
        name_variant: data.name + " (Sản phẩm chính)",
        price: data.price,
        image: data.image,
        color: "—",
        power: "—",
        connection_type: "—",
        has_microphone: "—",
        stock: "—",
        isMain: true,
      };

      data.variants = [mainVariant, ...data.variants];

      setProduct(data);
      setSelectedVariant(mainVariant);
    })();
  }, [slug]);

  if (!product) return <div className="container py-5">Đang tải...</div>;

  const displayData = selectedVariant;

  // ⭐ CHECK TỒN KHO
  const stock =
    displayData.stock === "—" ? 9999 : displayData.stock;

  const stockText =
    displayData.stock === "—"
      ? "Còn hàng"
      : displayData.stock > 0
      ? `Còn ${displayData.stock} sản phẩm`
      : "Hết hàng";

  const stockColor =
    displayData.stock === "—"
      ? "text-success"
      : displayData.stock > 0
      ? "text-success"
      : "text-danger";

  // ⭐ THÊM VÀO GIỎ HÀNG – DÙNG CartContext
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn phiên bản!");
      return;
    }

    if (qty > stock) {
           Swal.fire({
            icon: "danger",
            title: "Vượt quá số lượng tồn kho",
            showConfirmButton: false,
            timer: 1500,
            position: "center",
            });
      return;
    }

        addToCart({
            product_id: product.id,
            variant_id: selectedVariant?.id ?? null,
            product_name: selectedVariant?.name_variant || product.name,
            color: selectedVariant?.color || null,
            power: selectedVariant?.power || null,
            connection_type: selectedVariant?.connection_type || product.connection_type,
            has_microphone: selectedVariant?.has_microphone ?? 0,
            price: Number(selectedVariant?.price || product.price),
            quantity: qty,
            total: Number(selectedVariant?.price || product.price) * qty,
            image: selectedVariant?.image || product.image
            });

        Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng!",
            showConfirmButton: false,
            timer: 1500,
            position: "center",
            });
  };

  return (
    <div className="container my-4">

      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link
          to="/"
          className="breadcrumb-item text-secondary text-decoration-none"
        >
          Trang chủ
        </Link>
        <Link
          to="/san-pham"
          className="breadcrumb-item text-secondary text-decoration-none"
        >
          Sản phẩm
        </Link>
        <span className="breadcrumb-item active">{product.name}</span>
      </div>

      <div className="row g-4">

        {/* LEFT IMAGE */}
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded shadow-sm bg-white"
          >
            <img
              src={IMAGE_URL + displayData.image}
              alt={product.name}
              className="img-fluid rounded"
            />
          </motion.div>

          {/* GALLERY */}
          <div className="d-flex gap-2 mt-3">
            {product.variants.map((v) => (
              <img
                key={v.id}
                src={IMAGE_URL + v.image}
                className="rounded"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    selectedVariant?.id === v.id
                      ? "2px solid #ff4d4f"
                      : "1px solid #ddd",
                  padding: 2,
                  borderRadius: 10,
                }}
                onClick={() => setSelectedVariant(v)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="col-lg-7">
          <h3 className="fw-bold">{displayData.name_variant}</h3>

          {/* PRICE */}
          <h3 className="text-danger fw-bold mt-2">
            {Number(displayData.price).toLocaleString()} đ
          </h3>

          {/* STOCK */}
          <div className={`mt-1 fw-semibold ${stockColor}`}>
            {stockText}
          </div>

          {/* VARIANTS */}
          <div className="mt-4">
            <h6 className="fw-semibold mb-2">Phiên bản:</h6>
            <div className="d-flex flex-column gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  className={`btn text-start p-3 rounded-3 ${
                    selectedVariant?.id === v.id
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.name_variant}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mt-4 d-flex align-items-center gap-3">
            <span className="fw-semibold">Số lượng:</span>
            <div className="d-flex align-items-center border rounded px-3 py-1">
              <button
                className="btn btn-sm"
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
              >
                -
              </button>
              <span className="px-3">{qty}</span>
              <button
                className="btn btn-sm"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-danger btn-lg w-100 mt-4 fw-bold py-3 rounded-4"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </motion.button>

          {/* DESCRIPTION */}
          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <h5 className="fw-bold mb-2">Mô tả sản phẩm</h5>
            <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
              {showFullDesc
                ? product.description
                : product.description.slice(0, 250) + "..."}
            </p>

            <button
              className="btn btn-link p-0"
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              {showFullDesc ? "Thu gọn" : "Xem thêm"}{" "}
              {showFullDesc ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {/* SPECIFICATIONS */}
          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <h5 className="fw-bold mb-3">Thông số kỹ thuật</h5>
            <ul className="list-group small">
              <li className="list-group-item">
                <strong>Màu sắc:</strong> {displayData.color}
              </li>
              <li className="list-group-item">
                <strong>Công suất:</strong> {displayData.power}
              </li>
              <li className="list-group-item">
                <strong>Kết nối:</strong> {displayData.connection_type}
              </li>
              <li className="list-group-item">
                <strong>Micro:</strong>{" "}
                {displayData.has_microphone === 1
                  ? "Có"
                  : displayData.has_microphone === "—"
                  ? "—"
                  : "Không"}
              </li>
              <li className="list-group-item">
                <strong>Tồn kho:</strong> {stockText}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="mt-5">
        <h4 className="fw-bold">Sản phẩm liên quan</h4>
        <p className="text-muted">(Sẽ thêm API sau)</p>
      </div>

    </div>
  );
};

export default ProductDetail;
