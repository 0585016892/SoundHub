import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getBrands } from "../api/brandApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import { Spinner, Container, Row, Col, Form, Button, Breadcrumb, Offcanvas } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FiInbox, FiFilter, FiX } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtersData, setFiltersData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // State cho Mobile Filter
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location]);
  
  const category = query.get("category");
  const brand = query.get("brand");
  const page = Number(query.get("page")) || 1;

  useEffect(() => {
    (async () => {
      try {
        const [bRes, cRes] = await Promise.all([getBrands(), getCategories()]);
        setBrands(bRes?.data || bRes || []);
        setCategories(cRes?.data || cRes || []);
      } catch (err) {
        console.error("Lỗi tải bộ lọc:", err);
      }
    })();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const filters = Object.fromEntries(query.entries());
    const res = await getProducts(filters);
    setProducts(Array.isArray(res.products) ? res.products : []);
    setFiltersData(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search]);

  const updateQuery = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", 1);
    navigate(`/san-pham?${params.toString()}`);
    setShowMobileFilter(false); // Đóng menu sau khi chọn trên mobile
  };

  const applyPriceFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    minPrice ? params.set("min", minPrice) : params.delete("min");
    maxPrice ? params.set("max", maxPrice) : params.delete("max");
    params.set("page", 1);
    navigate(`/san-pham?${params.toString()}`);
    setShowMobileFilter(false);
  };

  // Component nội dung bộ lọc để tái sử dụng
  const FilterContent = () => (
    <div className="filter-sidebar">
      <div className="filter-header d-none d-lg-flex align-items-center mb-4">
        <HiOutlineAdjustmentsHorizontal size={24} className="accent-color me-2" />
        <h5 className="mb-0 fw-bold">BỘ LỌC</h5>
      </div>

      <div className="filter-group mb-4">
        <h6 className="filter-label">DANH MỤC</h6>
        <div className="filter-list">
           <div 
            className={`filter-item ${!category ? 'active' : ''}`}
            onClick={() => updateQuery("category", "")}
           >
             Tất cả sản phẩm
           </div>
           {categories.map(c => (
             <div 
              key={c.id} 
              className={`filter-item ${category === c.slug ? 'active' : ''}`}
              onClick={() => updateQuery("category", c.slug)}
             >
               {c.name}
             </div>
           ))}
        </div>
      </div>

      <div className="filter-group mb-4">
        <h6 className="filter-label">THƯƠNG HIỆU</h6>
        <Form.Select 
          className="filter-select"
          value={brand || ""}
          onChange={(e) => updateQuery("brand", e.target.value)}
        >
          <option value="">Chọn thương hiệu</option>
          {brands.map(b => (
            <option key={b.id} value={b.slug}>{b.name}</option>
          ))}
        </Form.Select>
      </div>

      <div className="filter-group">
        <h6 className="filter-label">KHOẢNG GIÁ (VNĐ)</h6>
        <Form onSubmit={applyPriceFilter}>
          <div className="price-inputs d-flex gap-2 mb-2">
            <input 
              type="number" placeholder="Từ" className="price-input" 
              value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            />
            <input 
              type="number" placeholder="Đến" className="price-input" 
              value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-100 btn-apply-filter">ÁP DỤNG</Button>
        </Form>
      </div>
    </div>
  );

  return (
    <div className="shop-page mt-5" style={{ background: "#050505", minHeight: "100vh", color: "#fff" }}>
      <Container className="pt-4 pb-5">
        
        {/* HEADER */}
        <div className="mb-4">
          <Breadcrumb className="custom-breadcrumb mb-2">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>Cửa hàng</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex justify-content-between align-items-end">
            <h2 className="fw-black text-uppercase tracking-tighter mb-0 fs-3 fs-md-2">
              {category ? `Loa ${filtersData?.selected_category_name || category}` : "Tất cả thiết bị"}
            </h2>
            {/* Mobile Filter Trigger */}
            <Button 
              className="d-lg-none btn-mobile-filter"
              onClick={() => setShowMobileFilter(true)}
            >
              <FiFilter className="me-2" /> Lọc
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* SIDEBAR FILTERS (DESKTOP) */}
          <Col lg={3} className="d-none d-lg-block">
            <FilterContent />
          </Col>

          {/* PRODUCT GRID */}
          <Col lg={9}>
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5">
                  <Spinner animation="grow" variant="warning" />
                  <span className="mt-3 text-secondary tracking-widest small">ĐANG TẢI...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5 empty-state">
                  <FiInbox size={60} className="text-secondary mb-3" />
                  <h4>Không tìm thấy sản phẩm</h4>
                  <Button variant="link" className="accent-color" onClick={() => navigate('/san-pham')}>Xóa bộ lọc</Button>
                </div>
              ) : (
                <Row className="g-3 g-md-4">
                  {products.map((item, index) => (
                    // xs={6} để hiển thị 2 cột trên điện thoại
                    <Col key={item.id} xs={6} md={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard item={item} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              )}
            </AnimatePresence>

            {/* PAGINATION */}
            {!loading && filtersData?.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5 overflow-auto pb-2">
                <div className="pagination-wrapper flex-nowrap">
                   <button 
                    className="p-btn d-none d-sm-flex" 
                    disabled={page === 1}
                    onClick={() => updateQuery("page", page - 1)}
                   >
                     Trước
                   </button>
                   {[...Array(filtersData.totalPages)].map((_, i) => (
                     <button
                       key={i}
                       className={`p-btn ${page === i + 1 ? "active" : ""}`}
                       onClick={() => updateQuery("page", i + 1)}
                     >
                       {i + 1}
                     </button>
                   ))}
                   <button 
                    className="p-btn d-none d-sm-flex" 
                    disabled={page === filtersData.totalPages}
                    onClick={() => updateQuery("page", page + 1)}
                   >
                     Sau
                   </button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* MOBILE FILTER OFFCANVAS */}
      <Offcanvas 
        show={showMobileFilter} 
        onHide={() => setShowMobileFilter(false)}
        placement="end"
        className="bg-dark text-white mobile-filter-canvas"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="fw-bold">BỘ LỌC TÌM KIẾM</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterContent />
        </Offcanvas.Body>
      </Offcanvas>

      <style>{`
        .accent-color { color: #ff6600; }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -1px; }
        
        .custom-breadcrumb .breadcrumb-item a { color: #888; text-decoration: none; font-size: 12px; }
        .custom-breadcrumb .breadcrumb-item.active { color: #ff6600; font-size: 12px; }

        /* Sidebar & Content */
        .filter-sidebar { background: #0a0a0a; padding: 20px; border-radius: 16px; border: 1px solid #1a1a1a; position: sticky; top: 100px; }
        .btn-mobile-filter { background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 8px; font-size: 14px; padding: 6px 15px; }
        .btn-mobile-filter:hover { background: #ff6600; }

        /* Filter Items */
        .filter-label { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #444; margin-bottom: 15px; text-transform: uppercase; }
        .filter-item { color: #888; font-size: 14px; cursor: pointer; transition: 0.2s; padding: 8px 0; border-bottom: 1px solid #111; }
        .filter-item:hover, .filter-item.active { color: #ff6600; font-weight: bold; }

        /* Form Controls */
        .filter-select { background: #000; border: 1px solid #222; color: #fff; border-radius: 8px; }
        .price-input { background: #000; border: 1px solid #222; color: #fff; width: 100%; padding: 10px; font-size: 13px; border-radius: 8px; }
        .btn-apply-filter { background: #ff6600; border: none; font-weight: bold; padding: 12px; border-radius: 8px; }

        /* Pagination */
        .pagination-wrapper { display: flex; gap: 8px; background: #0a0a0a; padding: 6px; border-radius: 50px; border: 1px solid #1a1a1a; width: fit-content; }
        .p-btn { background: transparent; border: none; color: #666; min-width: 35px; height: 35px; border-radius: 50%; font-size: 13px; font-weight: bold; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .p-btn.active { background: #ff6600; color: #fff; }
        .p-btn:disabled { opacity: 0.3; }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .shop-page { margin-top: 20px !important; }
          .pagination-wrapper { border-radius: 10px; gap: 4px; }
          .p-btn { min-width: 32px; height: 32px; font-size: 12px; }
          .mobile-filter-canvas { width: 85% !important; }
        }
      `}</style>
    </div>
  );
};

export default Products;