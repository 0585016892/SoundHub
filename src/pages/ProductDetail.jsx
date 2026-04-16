import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi2";
import { getProductDetail } from "../api/productApi";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const IMAGE_URL = `${process.env.REACT_APP_WEB_URL}/uploads/products/`;

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [qty, setQty] = useState(1);

 useEffect(() => {
  setQty(1);
}, [selectedVariant]);
useEffect(() => {
  (async () => {
    const data = await getProductDetail(slug);

    setProduct(data);

    if (data.variants && data.variants.length > 0) {
      setSelectedVariant(data.variants[0]);
    }
  })();
}, [slug]);
  if (!product) return <div className="loading-screen text-white text-center py-5">Đang tải giai điệu...</div>;

const displayData = selectedVariant || product;
const handleAddToCart = () => {
  if (displayData.stock === 0) {
    Swal.fire({
      icon: "error",
      title: "Sản phẩm đã hết hàng!",
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#ff6600",
    });
    return;
  }

  if (qty > displayData.stock) {
    Swal.fire({
      icon: "warning",
      title: `Chỉ còn ${displayData.stock} sản phẩm!`,
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#ff6600",
    });
    return;
  }

  addToCart({
  product_id: product.id,
  variant_id: selectedVariant?.id ?? null,
  product_name: selectedVariant?.name_variant || product.name,
  color: selectedVariant?.color || null,
  power: selectedVariant?.power || null,
  connection_type:
    selectedVariant?.connection_type || product.connection_type,
  has_microphone: selectedVariant?.has_microphone ?? 0,
  price: Number(selectedVariant?.price || product.price),
  quantity: qty,
  image: selectedVariant?.image || product.image,
  stock: selectedVariant?.stock || 0,   // 🔥 THÊM DÒNG NÀY
});

  Swal.fire({
    icon: "success",
    title: "Đã thêm vào giỏ hàng!",
    background: "#111",
    color: "#fff",
    confirmButtonColor: "#ff6600",
    timer: 1500,
  });
};

console.log(product);

  return (
    <div className="product-detail-dark mt-4 mt-md-5">
      <div className="container py-3 py-md-5">
        {/* Breadcrumb - Ẩn bớt trên mobile cho gọn */}
        <nav className="custom-breadcrumb mb-4 mb-md-5 d-none d-sm-block">
          <Link to="/">Home</Link> / <Link to="/san-pham">Shop</Link> / <span>{product.name}</span>
        </nav>

        <div className="row g-4 g-lg-5">
          {/* TRÁI: HÌNH ẢNH */}
          <div className="col-lg-6">
            <div className="sticky-md-top" style={{ top: "100px" }}>
              <motion.div
                key={displayData.image}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="main-image-container"
              >
                <img src={IMAGE_URL + displayData.image} alt={product.name} className="img-main" />
              </motion.div>

              <div className="gallery-scroll mt-3 mt-md-4">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    className={`gallery-item ${selectedVariant?.id === v.id ? "active" : ""}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    <img src={IMAGE_URL + v.image} alt="variant" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PHẢI: THÔNG TIN */}
          <div className="col-lg-6">
            <div className="product-info-panel">
              <span className="brand-tag">PREMIUM AUDIO</span>
              <h1 className="display-6 fw-black text-white mt-2 mb-2 mb-md-3">{displayData.name_variant || product.name}</h1>
              <div className="text-warning small mt-1">
                  Còn lại: {displayData.stock} sản phẩm
                </div>
              <div className="price-tag-large mb-3 mb-md-4">
                {Number(displayData.price).toLocaleString()} <span className="currency">VNĐ</span>
              </div>

              <div className="trust-badges mb-4">
                <div className="badge-item"><HiOutlineTruck /> 2H</div>
                <div className="badge-item"><HiOutlineShieldCheck /> 24T</div>
              </div>

              <hr className="border-secondary opacity-25" />

              {/* PHIÊN BẢN */}
              <div className="variant-section mb-4 mt-4">
                <label className="label-dim">LỰA CHỌN PHIÊN BẢN</label>
                <div className="variant-grid">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        className={`v-card ${selectedVariant?.id === v.id ? "active" : ""}`}
                        onClick={() => setSelectedVariant(v)}
                        title={v.name_variant} // Hiển thị tên đầy đủ khi di chuột vào
                      >
                        <div className="v-content">
                          <span className="v-name text-truncate">{v.name_variant}</span>
                          <span className="v-price">{Number(v.price).toLocaleString()} đ</span>
                        </div>
                      </button>
                    ))}
                  </div>
              </div>

              {/* MUA HÀNG - Cố định dưới chân trên mobile nếu cần, hoặc giữ nguyên */}
              <div className="purchase-section mb-4 mb-md-5">
                <div className="qty-selector">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}><FaMinus size={12} /></button>
                  <input type="number" value={qty} readOnly />
                  <button onClick={() =>setQty(Math.min(displayData?.stock || 1, qty + 1))}><FaPlus size={12} /></button>
                </div>
                <button
                    className="btn-add-cart"
                      onClick={handleAddToCart}
                      disabled={displayData.stock === 0}
                    >
                      {displayData.stock === 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ"}
                    </button>
              </div>

              {/* THÔNG SỐ KỸ THUẬT */}
              <div className="specs-grid mb-4 mb-md-5">
                <div className="spec-box">
                  <span className="s-label">Kết nối</span>
                  <span className="s-value">{displayData.connection_type}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Công suất</span>
                  <span className="s-value">{displayData.power}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Micro</span>
                  <span className="s-value">{displayData.has_microphone ? "Có" : "Không"}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Màu</span>
                  <span className="s-value">{displayData.color}</span>
                </div>
              </div>

              {/* MÔ TẢ */}
              <div className="description-box pb-5">
                <h6 className="text-white fw-bold mb-3">CHI TIẾT SẢN PHẨM</h6>
                <div className={`desc-content ${showFullDesc ? "full" : ""}`}>
                  {product.description}
                </div>
                <button className="btn-toggle-desc" onClick={() => setShowFullDesc(!showFullDesc)}>
                  {showFullDesc ? "Thu gọn ▲" : "Xem thêm ▼"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-dark { background: #050505; color: #fff; min-height: 100vh; }
        .fw-black { font-weight: 900; letter-spacing: -1px; }
        
        .custom-breadcrumb { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .custom-breadcrumb a { color: #555; text-decoration: none; transition: 0.3s; }
        .custom-breadcrumb a:hover { color: #ff6600; }
        .custom-breadcrumb span { color: #ff6600; }

        /* Hình ảnh */
        .main-image-container { background: #0a0a0a; border-radius: 16px; padding: 20px; border: 1px solid #1a1a1a; display: flex; justify-content: center; }
        .img-main { width: 100%; max-width: 450px; height: auto; object-fit: contain; }
        
        .gallery-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-item { width: 70px; height: 70px; background: #0a0a0a; border-radius: 10px; padding: 8px; cursor: pointer; border: 1px solid #1a1a1a; flex-shrink: 0; }
        .gallery-item.active { border-color: #ff6600; }
        .gallery-item img { width: 100%; height: 100%; object-fit: contain; }

        /* Thông tin */
        .brand-tag { color: #ff6600; font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .price-tag-large { font-size: 2rem; font-weight: 900; color: #ff6600; }
        .price-tag-large .currency { font-size: 1rem; color: #555; margin-left: 5px; }

        .trust-badges { display: flex; gap: 15px; }
        .badge-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #888; background: #111; padding: 5px 12px; border-radius: 50px; }
        .badge-item svg { color: #ff6600; }

        /* Phiên bản */
        .label-dim { font-size: 10px; color: #555; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 12px; }
        /* Đảm bảo Grid không bị bung khi nội dung bên trong quá dài */
        .variant-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* Ép 2 cột bằng nhau tuyệt đối */
          gap: 10px;
        }

        .v-card {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 10px;
          padding: 10px;
          text-align: left;
          width: 100%;       /* Đảm bảo nút luôn chiếm hết cột grid */
          min-width: 0;      /* Quan trọng: Cho phép các phần tử con thu nhỏ */
          display: block;    /* Chuyển về block để kiểm soát width tốt hơn */
        }

        .v-content {
          display: flex;
          flex-direction: column;
          min-width: 0;      /* Ép container chứa chữ phải tôn trọng chiều ngang */
        }

        .v-name {
          display: block;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          width: 100%;       /* Cần thiết để text-truncate hoạt động */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis; /* Dấu 3 chấm (...) */
        }

        .v-price {
          font-size: 11px;
          color: #666;
          white-space: nowrap; /* Giá tiền không nên xuống dòng */
        }

        /* Trên mobile cực nhỏ (iPhone SE, v.v.), nên chuyển về 1 cột */
        @media (max-width: 375px) {
          .variant-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Mua hàng */
        .purchase-section { display: flex; gap: 12px; }
        .qty-selector { display: flex; align-items: center; background: #111; border-radius: 10px; border: 1px solid #1a1a1a; }
        .qty-selector button { background: none; border: none; color: #fff; width: 35px; height: 35px; }
        .qty-selector input { background: none; border: none; color: #fff; width: 35px; text-align: center; font-weight: 700; font-size: 14px; }
        
        .btn-add-cart { flex-grow: 1; background: #ff6600; border: none; border-radius: 10px; color: #fff; font-weight: 900; font-size: 14px; transition: 0.3s; }

        /* Specs */
        .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #222; border-radius: 12px; overflow: hidden; border: 1px solid #222; }
        .spec-box { background: #0a0a0a; padding: 12px 15px; }
        .s-label { font-size: 10px; color: #444; text-transform: uppercase; font-weight: 800; display: block; }
        .s-value { color: #eee; font-weight: 600; font-size: 13px; }

        /* Mô tả */
        .desc-content { color: #888; font-size: 14px; line-height: 1.6; max-height: 80px; overflow: hidden; position: relative; }
        .desc-content.full { max-height: none; }
        .desc-content:not(.full)::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; background: linear-gradient(transparent, #050505); }
        .btn-toggle-desc { background: none; border: none; color: #ff6600; font-weight: 700; font-size: 12px; margin-top: 8px; }

        @media (max-width: 768px) {
          .price-tag-large { font-size: 1.8rem; }
          .main-image-container { padding: 30px; border-radius: 20px; }
          .v-card { padding: 10px; }
          .variant-grid { grid-template-columns: 1fr; } /* Stack variants on mobile if names are long */
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;