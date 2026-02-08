import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getBrands } from "../api/brandApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import { Spinner, Container, Row, Col, Form, Button, Breadcrumb } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiSliders, FiChevronRight, FiInbox } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtersData, setFiltersData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
  };

  const applyPriceFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    minPrice ? params.set("min", minPrice) : params.delete("min");
    maxPrice ? params.set("max", maxPrice) : params.delete("max");
    params.set("page", 1);
    navigate(`/san-pham?${params.toString()}`);
  };

  return (
    <div className="shop-page mt-5" style={{ background: "#050505", minHeight: "100vh", color: "#fff" }}>
      <Container className="pt-4 pb-5">
        
        {/* HEADER & BREADCRUMB */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Breadcrumb className="custom-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item active>Cửa hàng</Breadcrumb.Item>
            </Breadcrumb>
            <h2 className="fw-black text-uppercase tracking-tighter">
              {category ? `Loa ${filtersData?.selected_category_name || category}` : "Tất cả thiết bị"}
            </h2>
          </div>
          <div className="d-none d-md-block">
             <span className="text-secondary small">Hiển thị {products.length} kết quả</span>
          </div>
        </div>

        <Row className="g-4">
          {/* SIDEBAR FILTERS */}
          <Col lg={3}>
            <div className="filter-sidebar">
              <div className="filter-header d-flex align-items-center mb-4">
                <HiOutlineAdjustmentsHorizontal size={24} className="accent-color me-2" />
                <h5 className="mb-0 fw-bold">BỘ LỌC</h5>
              </div>

              {/* Category Filter */}
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

              {/* Brand Filter */}
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

              {/* Price Filter */}
              <div className="filter-group">
                <h6 className="filter-label">KHOẢNG GIÁ (VNĐ)</h6>
                <Form onSubmit={applyPriceFilter}>
                  <div className="price-inputs d-flex gap-2 mb-2">
                    <input 
                      type="number" 
                      placeholder="Từ" 
                      className="price-input" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="Đến" 
                      className="price-input" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-100 btn-apply-filter">ÁP DỤNG</Button>
                </Form>
              </div>
            </div>
          </Col>

          {/* PRODUCT GRID */}
          <Col lg={9}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="d-flex flex-column justify-content-center align-items-center py-5"
                >
                  <Spinner animation="grow" variant="warning" />
                  <span className="mt-3 text-secondary tracking-widest">ĐANG TẢI ÂM THANH...</span>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-5 empty-state"
                >
                  <FiInbox size={80} className="text-secondary mb-3" />
                  <h3>Rất tiếc, chưa có sản phẩm này</h3>
                  <p className="text-secondary">Hãy thử điều chỉnh bộ lọc để tìm thấy giai điệu phù hợp.</p>
                  <Button variant="outline-light" onClick={() => navigate('/san-pham')}>Xóa tất cả bộ lọc</Button>
                </motion.div>
              ) : (
                <Row className="g-4">
                  {products.map((item, index) => (
                    <Col key={item.id} sm={6} md={4}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard item={item} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              )}
            </AnimatePresence>

            {/* MODERN PAGINATION */}
            {!loading && filtersData?.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <div className="pagination-wrapper">
                   <button 
                    className="p-btn" 
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
                    className="p-btn" 
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

      <style>{`
        .accent-color { color: #ff6600; }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -1.5px; }
        
        /* Custom Breadcrumb */
        .custom-breadcrumb .breadcrumb-item a { color: #888; text-decoration: none; font-size: 13px; }
        .custom-breadcrumb .breadcrumb-item.active { color: #ff6600; font-size: 13px; }
        .custom-breadcrumb .breadcrumb-item + .breadcrumb-item::before { color: #333; content: ">"; }

        /* Filter Sidebar */
        .filter-sidebar { background: #0a0a0a; padding: 25px; border-radius: 16px; border: 1px solid #1a1a1a; position: sticky; top: 100px; }
        .filter-label { font-size: 12px; font-weight: 800; letter-spacing: 1px; color: #444; margin-bottom: 15px; }
        
        .filter-list { display: flex; flex-direction: column; gap: 8px; }
        .filter-item { color: #888; font-size: 14px; cursor: pointer; transition: 0.3s; padding: 5px 0; }
        .filter-item:hover { color: #ff6600; padding-left: 5px; }
        .filter-item.active { color: #ff6600; font-weight: bold; }

        .filter-select { background: #000; border: 1px solid #222; color: #fff; font-size: 14px; border-radius: 8px; padding: 10px; }
        .filter-select:focus { background: #000; color: #fff; border-color: #ff6600; box-shadow: none; }

        .price-input { background: #000; border: 1px solid #222; color: #fff; width: 100%; padding: 8px; font-size: 13px; border-radius: 6px; }
        .price-input:focus { outline: none; border-color: #ff6600; }
        .btn-apply-filter { background: #ff6600; border: none; font-weight: 800; font-size: 12px; padding: 10px; border-radius: 6px; transition: 0.3s; }
        .btn-apply-filter:hover { background: #fff; color: #000; }

        /* Pagination */
        .pagination-wrapper { display: flex; gap: 10px; background: #0a0a0a; padding: 8px; border-radius: 50px; border: 1px solid #1a1a1a; }
        .p-btn { background: transparent; border: none; color: #666; width: 40px; height: 40px; border-radius: 50%; font-size: 14px; font-weight: bold; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .p-btn:hover { color: #ff6600; background: #151515; }
        .p-btn.active { background: #ff6600; color: #fff; }
        .p-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .p-btn:not(.active) { min-width: 60px; border-radius: 20px; }

        .empty-state h3 { font-weight: 800; color: #fff; }
        .tracking-widest { letter-spacing: 4px; font-size: 10px; }
      `}</style>
    </div>
  );
};

export default Products;