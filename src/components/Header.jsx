import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Badge,
  Container,
  Dropdown,
} from "react-bootstrap";
import { BiSearch, BiCart } from "react-icons/bi";
import { IoLogIn } from "react-icons/io5";
import { useUser } from "../context/UserContext";
import { getCategories } from "../api/categoryApi";
import { getBrands } from "../api/brandApi";
import Logo from "../assets/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const API_URL = "http://localhost:5000";

  const cartCount = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).length
    : 0;

  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setShowCategory(false);
    setShowBrands(false);
    navigate(`/search?search=${keyword}`);
  };

  const handleCategoryHover = async () => {
    setShowCategory(true);
    if (categories.length === 0) {
      const res = await getCategories();
      setCategories(res?.data || res || []);
    }
  };

  const handleBrandHover = async () => {
    setShowBrands(true);
    if (brands.length === 0) {
      const res = await getBrands();
      setBrands(res?.data || res || []);
    }
  };

  return (
    <header className="shadow-sm">
      {/* TOP BAR */}
      <div className="py-2 bg-dark text-white text-center small">
        🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ
      </div>

      {/* MAIN NAV */}
      <Navbar bg="white" expand="lg" className="py-3">
        <Container>

          {/* LOGO */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-3 d-flex align-items-center"
          >
            <img
              src={Logo}
              alt="logo"
              height={45}
              className="rounded shadow-sm me-2"
            />
            <span className="text-dark">Sound</span>
            <span style={{ color: "#ff6b00" }}>Hub</span>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse id="main-navbar">

            {/* LEFT NAV */}
            <Nav className="me-auto fw-semibold align-items-center">
              <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>

              {/* CATEGORY */}
              <div
                className="nav-hover-area"
                onMouseEnter={handleCategoryHover}
                onMouseLeave={() => setShowCategory(false)}
              >
                <Nav.Link>Sản phẩm</Nav.Link>

                {showCategory && (
                  <div className="dropdown-menu-custom">
                    <h6 className="fw-bold mb-3 border-bottom pb-2">Danh mục loa</h6>
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/san-pham?category=${c.slug}`}
                        className="dropdown-item-link"
                      >
                        <img
                          src={`${API_URL}/uploads/products/${c.image}`}
                          alt={c.name}
                          width="45"
                          height="45"
                          className="rounded me-2 border"
                        />
                        <span>{c.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* BRANDS */}
              <div
                className="nav-hover-area"
                onMouseEnter={handleBrandHover}
                onMouseLeave={() => setShowBrands(false)}
              >
                <Nav.Link>Thương hiệu</Nav.Link>

                {showBrands && (
                  <div className="dropdown-menu-custom">
                    <h6 className="fw-bold mb-3 border-bottom pb-2">Thương hiệu nổi bật</h6>
                    {brands.map((b) => (
                      <Link
                        key={b.id}
                        to={`/san-pham?brand=${b.slug}`}
                        className="dropdown-item-link"
                      >
                        <img
                          src={`${API_URL}/uploads/products/${b.logo}`}
                          alt={b.name}
                          width="45"
                          height="45"
                          className="rounded me-2 border"
                        />
                        <span>{b.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Nav.Link as={Link} to="/lien-he">Liên hệ</Nav.Link>
            </Nav>

          </Navbar.Collapse>

          {/* SEARCH FORM */}
          <Form className="d-flex me-4 search-box" onSubmit={handleSearch}>
            <FormControl
              placeholder="Tìm loa JBL, Sony..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <BiSearch size={20} />
            </button>
          </Form>

          {/* USER + CART */}
          <Nav className="align-items-center">

            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  className="rounded-pill px-3 py-2 shadow-sm"
                >
                  {user.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/tai-khoan">Thông tin cá nhân</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                <IoLogIn size={26} />
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/gio-hang" className="ms-3 position-relative">
              <BiCart size={28} />
              {cartCount > 0 && (
                <Badge bg="danger" pill className="cart-badge">{cartCount}</Badge>
              )}
            </Nav.Link>

          </Nav>
        </Container>
      </Navbar>

      {/* CUSTOM CSS */}
      <style>{`
        .nav-hover-area { position: relative; }
        .nav-hover-area::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 30px;
          background: transparent;
          pointer-events: auto;
        }
        .dropdown-item-link {
          display: flex;
          align-items: center;
          padding: 6px 0;
          text-decoration: none;
          color: #222;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .dropdown-item-link:hover { background: #f7f7f7; }
        .dropdown-menu-custom {
          position: absolute;
          top: 55px;
          left: 0;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          width: 420px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          z-index: 1000;
          animation: fadeDown 0.25s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-box { position: relative; }
        .search-box input { border-radius: 25px; padding-left: 16px; padding-right: 45px; }
        .search-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .cart-badge { position: absolute; top: -6px; right: -10px; }
      `}</style>
    </header>
  );
};

export default Header;
