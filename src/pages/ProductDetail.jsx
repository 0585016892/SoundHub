import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi2";
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

  useEffect(() => {
    (async () => {
      const data = await getProductDetail(slug);
      const mainVariant = {
        id: 0,
        name_variant: data.name,
        price: data.price,
        image: data.image,
        color: "Tiêu chuẩn",
        power: data.power || "—",
        connection_type: data.connection_type || "—",
        has_microphone: data.has_microphone || 0,
        stock: 99,
        isMain: true,
      };
      data.variants = [mainVariant, ...data.variants];
      setProduct(data);
      setSelectedVariant(mainVariant);
    })();
  }, [slug]);

  if (!product) return <div className="loading-screen">Đang tải giai điệu...</div>;

  const displayData = selectedVariant;
  const stock = displayData.stock === "—" ? 999 : displayData.stock;

  const handleAddToCart = () => {
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
      image: selectedVariant?.image || product.image
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

  return (
    <div className="product-detail-dark mt-5">
      <div className="container py-5">
        {/* Breadcrumb Luxury */}
        <nav className="custom-breadcrumb mb-5">
          <Link to="/">Home</Link> / <Link to="/san-pham">Shop</Link> / <span>{product.name}</span>
        </nav>

        <div className="row g-5">
          {/* TRÁI: KHÔNG GIAN HÌNH ẢNH */}
          <div className="col-lg-6">
            <div className="sticky-top" style={{ top: "100px" }}>
              <motion.div
                key={displayData.image}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="main-image-container"
              >
                <img src={IMAGE_URL + displayData.image} alt={product.name} className="img-main" />
              </motion.div>

              <div className="gallery-scroll mt-4">
                {product.variants.map((v) => (
                  <motion.div
                    key={v.id}
                    whileHover={{ y: -5 }}
                    className={`gallery-item ${selectedVariant?.id === v.id ? "active" : ""}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    <img src={IMAGE_URL + v.image} alt="variant" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* PHẢI: THÔNG TIN SẢN PHẨM */}
          <div className="col-lg-6">
            <div className="product-info-panel">
              <span className="brand-tag">PREMIUM AUDIO</span>
              <h1 className="display-5 fw-black text-white mt-2 mb-3">{displayData.name_variant}</h1>
              
              <div className="price-tag-large mb-4">
                {Number(displayData.price).toLocaleString()} <span className="currency">VNĐ</span>
              </div>

              <div className="trust-badges mb-4">
                <div className="badge-item"><HiOutlineTruck /> Giao nhanh 2h</div>
                <div className="badge-item"><HiOutlineShieldCheck /> Bảo hành 24T</div>
              </div>

              {/* PHIÊN BẢN */}
              <div className="variant-section mb-4">
                <label className="label-dim">CHỌN PHIÊN BẢN</label>
                <div className="variant-grid">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`v-card ${selectedVariant?.id === v.id ? "active" : ""}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      <span className="v-name">{v.name_variant}</span>
                      <span className="v-price">{Number(v.price).toLocaleString()} đ</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SỐ LƯỢNG & MUA HÀNG */}
              <div className="purchase-section mb-5">
                <div className="qty-selector">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}><FaMinus /></button>
                  <input type="number" value={qty} readOnly />
                  <button onClick={() => setQty(qty + 1)}><FaPlus /></button>
                </div>
                <button className="btn-add-cart" onClick={handleAddToCart}>
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>

              {/* THÔNG SỐ KỸ THUẬT - DẠNG TAB HOẶC GRID */}
              <div className="specs-grid mb-5">
                <div className="spec-box">
                  <span className="s-label">Kết nối</span>
                  <span className="s-value">{displayData.connection_type}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Công suất</span>
                  <span className="s-value">{displayData.power}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Microphone</span>
                  <span className="s-value">{displayData.has_microphone ? "Tích hợp" : "Không"}</span>
                </div>
                <div className="spec-box">
                  <span className="s-label">Màu sắc</span>
                  <span className="s-value">{displayData.color}</span>
                </div>
              </div>

              {/* MÔ TẢ */}
              <div className="description-box">
                <h5 className="text-white fw-bold mb-3">CHI TIẾT SẢN PHẨM</h5>
                <div className={`desc-content ${showFullDesc ? "full" : ""}`}>
                  {product.description}
                </div>
                <button className="btn-toggle-desc" onClick={() => setShowFullDesc(!showFullDesc)}>
                  {showFullDesc ? "Thu gọn" : "Đọc thêm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-dark { background: #050505; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .fw-black { font-weight: 900; letter-spacing: -1px; }
        
        .custom-breadcrumb { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
        .custom-breadcrumb a { color: #666; text-decoration: none; }
        .custom-breadcrumb span { color: #ff6600; }

        /* Image Styling */
        .main-image-container { background: #0a0a0a; border-radius: 24px; padding: 40px; border: 1px solid #1a1a1a; }
        .img-main { width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5)); }
        
        .gallery-scroll { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
        .gallery-item { width: 90px; height: 90px; background: #0a0a0a; border-radius: 12px; padding: 10px; cursor: pointer; border: 1px solid #1a1a1a; flex-shrink: 0; }
        .gallery-item.active { border-color: #ff6600; box-shadow: 0 0 15px rgba(255, 102, 0, 0.2); }
        .gallery-item img { width: 100%; height: 100%; object-fit: contain; }

        /* Info Styling */
        .brand-tag { color: #ff6600; font-size: 12px; font-weight: 800; letter-spacing: 3px; }
        .price-tag-large { font-size: 3rem; font-weight: 900; color: #ff6600; }
        .price-tag-large .currency { font-size: 1.2rem; color: #444; margin-left: 10px; }

        .trust-badges { display: flex; gap: 20px; }
        .badge-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #888; }
        .badge-item svg { color: #ff6600; font-size: 18px; }

        /* Variants Grid */
        .label-dim { font-size: 11px; color: #444; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 15px; }
        .variant-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .v-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 15px; text-align: left; transition: 0.3s; }
        .v-card.active { border-color: #ff6600; background: #111; }
        .v-name { display: block; color: #fff; font-weight: 700; font-size: 14px; }
        .v-price { font-size: 12px; color: #666; }

        /* Purchase Styling */
        .purchase-section { display: flex; gap: 20px; }
        .qty-selector { display: flex; align-items: center; background: #0a0a0a; border-radius: 12px; border: 1px solid #1a1a1a; padding: 5px; }
        .qty-selector button { background: none; border: none; color: #fff; width: 40px; height: 40px; cursor: pointer; }
        .qty-selector input { background: none; border: none; color: #fff; width: 50px; text-align: center; font-weight: 700; }
        
        .btn-add-cart { flex-grow: 1; background: #ff6600; border: none; border-radius: 12px; color: #fff; font-weight: 900; letter-spacing: 1px; transition: 0.3s; }
        .btn-add-cart:hover { background: #fff; color: #000; box-shadow: 0 10px 20px rgba(255,102,0,0.3); }

        /* Specs Styling */
        .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a1a; }
        .spec-box { background: #0a0a0a; padding: 20px; display: flex; flex-direction: column; }
        .s-label { font-size: 11px; color: #444; text-transform: uppercase; font-weight: 800; }
        .s-value { color: #fff; font-weight: 600; font-size: 14px; margin-top: 5px; }

        /* Description Styling */
        .desc-content { color: #888; font-size: 15px; line-height: 1.8; max-height: 100px; overflow: hidden; position: relative; }
        .desc-content.full { max-height: none; }
        .desc-content::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 50px; background: linear-gradient(transparent, #050505); }
        .desc-content.full::after { display: none; }
        .btn-toggle-desc { background: none; border: none; color: #ff6600; font-weight: 700; font-size: 13px; margin-top: 10px; padding: 0; }
      `}</style>
    </div>
  );
};

export default ProductDetail;