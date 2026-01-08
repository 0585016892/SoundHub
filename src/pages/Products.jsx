import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { getBrands } from "../api/brandApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import { Col, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaSoundcloud } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtersData, setFiltersData] = useState(null);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  /** ──────────────────────────────
   *  Lấy query params
   * ────────────────────────────── */
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  const category = query.get("category");
  const brand = query.get("brand");

  /** ──────────────────────────────
   *  Fetch categories + brands
   * ────────────────────────────── */
  useEffect(() => {
    (async () => {
      setBrands(await getBrands());
      setCategories(await getCategories());
    })();
  }, []);

  /** ──────────────────────────────
   *  Fetch product list
   * ────────────────────────────── */
  const fetchProducts = async () => {
    setLoading(true);

    const filters = Object.fromEntries(query.entries());

    const res = await getProducts(filters);

    const list = Array.isArray(res.products) ? res.products : [];

    setProducts(list);
    setFiltersData(res);
    setPage(Number(filters.page) || 1);
    setTotalPages(res.totalPages || 1);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  /** ──────────────────────────────
   *  Update query params
   * ────────────────────────────── */
  const updateQuery = (key, value) => {
    const params = new URLSearchParams(location.search);

    if (value) params.set(key, value);
    else params.delete(key);

    params.set("page", 1);
    navigate(`/san-pham?${params.toString()}`);
  };

  /** ──────────────────────────────
   *  Apply price filter
   * ────────────────────────────── */
  const applyPriceFilter = () => {
    const params = new URLSearchParams(location.search);

    minPrice ? params.set("min", minPrice) : params.delete("min");
    maxPrice ? params.set("max", maxPrice) : params.delete("max");

    params.set("page", 1);
    navigate(`/san-pham?${params.toString()}`);
  };
console.log(filtersData);

  return (
    <div className="container mt-4">

      {/* TITLE */}
      <motion.div
        className="fw-bold d-flex align-items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >

      {/* BREADCRUMB */}
      <div className="breadcrumb mb-4">
        <span className="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-secondary">
            Trang chủ
          </Link>
        </span>

        {category && (
          <span className="breadcrumb-item text-dark fw-semibold">
            Danh mục: {filtersData?.selected_category_name || category}
          </span>
        )}

        {brand && (
          <span className="breadcrumb-item text-dark fw-semibold">
            Thương hiệu: {filtersData?.selected_brand_name || brand}
          </span>
        )}
      </div>
      </motion.div>

      <div className="row">

        {/* SIDEBAR */}
        <motion.div
          className="col-md-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="card p-3 shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Bộ lọc</h5>

            {/* CATEGORY */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Danh mục</label>
              <select
                className="form-select"
                value={category || ""}
                onChange={(e) => updateQuery("category", e.target.value)}
              >
                <option value="">Tất cả</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BRAND */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Thương hiệu</label>
              <select
                className="form-select"
                value={brand || ""}
                onChange={(e) => updateQuery("brand", e.target.value)}
              >
                <option value="">Tất cả</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE FILTER */}
            <div>
              <label className="form-label fw-semibold">Khoảng giá (VNĐ)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button className="btn btn-dark w-100 mt-2" onClick={applyPriceFilter}>
                Áp dụng
              </button>
            </div>
          </div>
        </motion.div>

        {/* PRODUCT LIST */}
        <div className="col-md-9">

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              className="text-center text-muted py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaSoundcloud size={120} />
              <h5 className="mt-3">Không tìm thấy sản phẩm phù hợp</h5>
              <p>Hãy thử thay đổi bộ lọc tìm kiếm.</p>
            </motion.div>
          ) : (
            <div className="row">
              {products.map((item) => (
                <motion.div
                  key={item.id}
                  className="col-md-4 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => updateQuery("page", i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
