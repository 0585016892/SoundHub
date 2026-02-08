import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { searchProducts } from "../api/productApi";
import { Spinner, Row, Col } from "react-bootstrap";
import { FaSearch, FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("search") || "";
  const pageParam = parseInt(queryParams.get("page")) || 1;

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await searchProducts({ keyword, page, limit: 12 });
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, page]);

  useEffect(() => setPage(pageParam), [pageParam]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    navigate(`/search?search=${keyword}&page=${newPage}`);
  };

  return (
    <div className="search-page-wrapper">
      <div className="container py-5">
        {/* BREADCRUMB & FILTER HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="search-breadcrumb">
            <Link to="/">HOME</Link> / <span>SEARCH RESULTS</span>
          </div>
          <div className="results-count">
            <span className="accent">{products.length}</span> SẢN PHẨM ĐƯỢC TÌM THẤY
          </div>
        </div>

        {/* SEARCH TITLE AREA */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="search-header-box mb-5"
        >
          <h2 className="search-keyword-title">
            KẾT QUẢ CHO: <span className="keyword-text">"{keyword.toUpperCase()}"</span>
          </h2>
          <div className="title-underline"></div>
        </motion.div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="search-loading-state">
            <Spinner animation="grow" variant="warning" />
            <p className="mt-3 text-secondary">ĐANG QUÉT DỮ LIỆU ÂM THANH...</p>
          </div>
        ) : products.length === 0 ? (
          /* EMPTY STATE - LUXURY VERSION */
          <motion.div
            className="empty-search-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-search-icon">
              <FaSearch />
              <div className="scan-line"></div>
            </div>
            <h3>KHÔNG TÌM THẤY SẢN PHẨM</h3>
            <p>Chúng tôi không tìm thấy kết quả cho từ khóa của bạn.<br/>Hãy thử sử dụng các thuật ngữ tổng quát hơn.</p>
            <Link to="/san-pham" className="btn-back-shop">
              KHÁM PHÁ BỘ SƯU TẬP
            </Link>
          </motion.div>
        ) : (
          <>
            {/* PRODUCT GRID */}
            <Row className="g-4">
              <AnimatePresence mode="popLayout">
                {products.map((item, index) => (
                  <Col key={item.id} lg={3} md={4} xs={6}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard item={item} />
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>

            {/* MODERN PAGINATION */}
            {totalPages > 1 && (
              <div className="luxury-pagination mt-5">
                <button 
                  className="pag-nav" 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page <= 1}
                >
                  <FaArrowLeft />
                </button>
                
                <div className="pag-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={page === i + 1 ? "pag-num active" : "pag-num"}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {(i + 1).toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>

                <button 
                  className="pag-nav" 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page >= totalPages}
                >
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .search-page-wrapper {
          background: #050505;
          min-height: 100vh;
          color: #fff;
          font-family: 'Inter', sans-serif;
        }

        .accent { color: #ff6600; font-weight: 800; }

        .search-breadcrumb { font-size: 11px; letter-spacing: 2px; color: #444; }
        .search-breadcrumb a { color: #888; text-decoration: none; transition: 0.3s; }
        .search-breadcrumb a:hover { color: #ff6600; }

        .results-count { font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #666; }

        /* Title Style */
        .search-header-box { position: relative; }
        .search-keyword-title { 
          font-weight: 900; 
          font-size: 2.5rem; 
          letter-spacing: -1px;
          margin-bottom: 10px;
        }
        .keyword-text { color: #ff6600; }
        .title-underline {
          width: 60px; height: 4px; background: #ff6600; border-radius: 2px;
        }

        /* Loading State */
        .search-loading-state {
          height: 400px; display: flex; flex-direction: column; 
          align-items: center; justify-content: center;
        }

        /* Empty State */
        .empty-search-container {
          text-align: center; padding: 100px 0; background: #0a0a0a;
          border-radius: 30px; border: 1px solid #1a1a1a;
        }
        .empty-search-icon {
          position: relative; font-size: 50px; color: #222; margin-bottom: 30px;
          display: inline-block;
        }
        .scan-line {
          position: absolute; top: 0; left: 0; width: 100%; height: 2px;
          background: #ff6600; box-shadow: 0 0 15px #ff6600;
          animation: scan 2s infinite linear;
        }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        
        .empty-search-container h3 { font-weight: 900; letter-spacing: 2px; }
        .empty-search-container p { color: #666; margin-bottom: 30px; }
        .btn-back-shop {
          background: #ff6600; color: #fff; padding: 15px 40px; 
          text-decoration: none; font-weight: 800; border-radius: 50px;
          transition: 0.4s; box-shadow: 0 10px 20px rgba(255,102,0,0.2);
        }
        .btn-back-shop:hover { background: #fff; color: #000; }

        /* Pagination Luxury */
        .luxury-pagination {
          display: flex; align-items: center; justify-content: center; gap: 30px;
        }
        .pag-numbers { display: flex; gap: 10px; }
        .pag-num {
          background: transparent; border: 1px solid #222; color: #555;
          width: 40px; height: 40px; border-radius: 50%; font-weight: 700;
          transition: 0.3s;
        }
        .pag-num.active { background: #ff6600; border-color: #ff6600; color: #fff; box-shadow: 0 0 15px rgba(255,102,0,0.3); }
        .pag-num:hover:not(.active) { border-color: #ff6600; color: #ff6600; }

        .pag-nav {
          background: #111; border: 1px solid #222; color: #fff;
          width: 45px; height: 45px; border-radius: 12px; display: flex;
          align-items: center; justify-content: center; transition: 0.3s;
        }
        .pag-nav:hover:not(:disabled) { background: #ff6600; border-color: #ff6600; transform: translateY(-3px); }
        .pag-nav:disabled { opacity: 0.2; cursor: not-allowed; }

        @media (max-width: 768px) {
          .search-keyword-title { font-size: 1.5rem; }
          .pag-num { width: 35px; height: 35px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

export default SearchPage;