import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { searchProducts } from "../api/productApi";
import { Spinner ,Card, Button} from "react-bootstrap";
import "../assets/search.css";
import { FaSearch } from "react-icons/fa";
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
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotalPages(1);
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
    <div className="container search-premium-container">
      {/* BREADCRUMB */}
      <div className="sp-breadcrumb">
        <Link to="/">Trang chủ</Link> / 
        <span>Kết quả tìm kiếm</span>
      </div>

      {/* TITLE */}
      <h2 className="sp-title">
        Kết quả cho: <strong>"{keyword}"</strong>
      </h2>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : products.length === 0 ? (
         <motion.div
            className="d-flex justify-content-center align-items-center py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center p-5 shadow-lg border-0 rounded-4" style={{ maxWidth: "450px" }}>
              <div className="mb-4">
                <FaSearch size={60} className="text-warning" />
              </div>
              <h4 className="fw-bold mb-3">Không tìm thấy sản phẩm</h4>
              <p className="text-muted mb-4">Hãy thử lại với từ khóa khác hoặc quay lại trang chủ để khám phá thêm sản phẩm.</p>
              <Link to="/">
                <Button
                  className="px-4 py-2 fw-bold"
                  style={{
                    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
                    border: "none",
                    borderRadius: "50px",
                    boxShadow: "0 4px 15px rgba(91,134,229,0.4)"
                  }}
                >
                  Quay lại trang chủ
                </Button>
              </Link>
            </Card>
          </motion.div>
      ) : (
        <>
          {/* GRID */}
          <div className="row g-4 mt-3">
            {products.map((item) => (
              <motion.div
                key={item.id}
                className="col-md-3 col-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.15 }}
              >
                <ProductCard item={item} />
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="sp-pagination mt-4 text-center">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>←</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>→</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
