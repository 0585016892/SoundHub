import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Badge, Container, Dropdown, Row, Col } from "react-bootstrap";
import { BiSearch, BiCart, BiUserCircle } from "react-icons/bi";
import { RiMenu4Line } from "react-icons/ri";
import { useUser } from "../context/UserContext";
import { getCategories } from "../api/categoryApi";
import { getBrands } from "../api/brandApi";
import Logo from "../assets/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const API_URL = "http://localhost:20032";

  const [cartCount, setCartCount] = useState(0);
  const [showCategory, setShowCategory] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");

  // Cập nhật giỏ hàng theo thời gian thực đơn giản
  useEffect(() => {
    const updateCart = () => {
      const cart = localStorage.getItem("cart");
      setCartCount(cart ? JSON.parse(cart).length : 0);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?search=${keyword}`);
  };

  const loadCategories = async () => {
    setShowCategory(true);
    if (categories.length === 0) {
      const res = await getCategories();
      setCategories(res?.data || res || []);
    }
  };

  const loadBrands = async () => {
    setShowBrands(true);
    if (brands.length === 0) {
      const res = await getBrands();
      setBrands(res?.data || res || []);
    }
  };

  return (
    <header className="fixed-top shadow-lg">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="top-bar py-1">
        <Container className="d-flex justify-content-between align-items-center">
          <span className="small fw-light">Miễn phí vận chuyển toàn quốc cho đơn từ 5tr</span>
          <div className="top-links d-none d-md-block">
            <Link to="/gioi-thieu">Hệ thống cửa hàng</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>
        </Container>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <Navbar variant="dark" expand="lg" className="main-nav py-2">
        <Container>
          {/* MOBILE TOGGLE */}
          <Navbar.Toggle aria-controls="navbar-soundhub" className="border-0 shadow-none ps-0">
            <RiMenu4Line size={28} color="#fff" />
          </Navbar.Toggle>

          {/* LOGO */}
          <Navbar.Brand as={Link} to="/" className="brand-logo d-flex align-items-center">
            <img src={Logo} alt="SoundHub" className="logo-img me-2" />
            <span className="fw-black tracking-tight">SOUND<span className="accent-color">HUB</span></span>
          </Navbar.Brand>

          <Navbar.Collapse id="navbar-soundhub">
            <Nav className="mx-auto nav-links">
              <Nav.Link as={Link} to="/" className="px-3">Home</Nav.Link>
              
              {/* MEGA MENU CATEGORY */}
              <div 
                className="mega-menu-trigger px-3 nav-link cursor-pointer"
                onMouseEnter={loadCategories}
                onMouseLeave={() => setShowCategory(false)}
              >
                Sản phẩm
                {showCategory && (
                  <div className="mega-menu-container">
                    <Container>
                      <Row className="py-4">
                        <Col md={3} className="border-end border-secondary">
                          <h6 className="accent-color fw-bold mb-3">DANH MỤC LOA</h6>
                          <p className="small text-muted">Trải nghiệm âm thanh đỉnh cao từ những dòng loa tuyển chọn.</p>
                        </Col>
                        <Col md={9}>
                          <Row>
                            {categories.map((c) => (
                              <Col md={4} key={c.id} className="mb-2">
                                <Link to={`/san-pham?category=${c.slug}`} className="mega-item">
                                  <img src={`${API_URL}/uploads/products/${c.image}`} alt="" className="item-thumb" />
                                  <span>{c.name}</span>
                                </Link>
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                )}
              </div>

              {/* MEGA MENU BRAND */}
              <div 
                className="mega-menu-trigger px-3 nav-link cursor-pointer"
                onMouseEnter={loadBrands}
                onMouseLeave={() => setShowBrands(false)}
              >
                Thương hiệu
                {showBrands && (
                  <div className="mega-menu-container">
                    <Container>
                      <Row className="py-4">
                        <Col md={3} className="border-end border-secondary">
                          <h6 className="accent-color fw-bold mb-3">NHÀ SẢN XUẤT</h6>
                          <p className="small text-muted">Đại diện chính hãng của hơn 20 thương hiệu âm thanh toàn cầu.</p>
                        </Col>
                        <Col md={9}>
                          <Row>
                            {brands.map((b) => (
                              <Col md={3} key={b.id} className="mb-3">
                                <Link to={`/san-pham?brand=${b.slug}`} className="mega-item brand-item">
                                  <img src={`${API_URL}/uploads/products/${b.logo}`} alt={b.name} />
                                </Link>
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                )}
              </div>

              <Nav.Link as={Link} to="/tin-tuc" className="px-3">Tạp chí âm thanh</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* ACTIONS */}
          <div className="header-actions d-flex align-items-center">
            {/* SEARCH BOX */}
            <Form className="d-none d-xl-flex search-group me-3" onSubmit={handleSearch}>
              <button type="submit" className="search-icon"><BiSearch size={20} /></button>
              <FormControl
                placeholder="Tìm kiếm âm thanh..."
                className="glass-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Form>

            {/* USER */}
            <div className="action-item me-3">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle className="user-toggle bg-transparent border-0 shadow-none p-0">
                    <img 
                      src={user.avatar ? `${API_URL}/uploads/users/${user.avatar}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                      alt="user" 
                      className="user-avatar" 
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant="dark" className="mt-2">
                    <Dropdown.Item as={Link} to="/tai-khoan">Hồ sơ của tôi</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/don-hang">Lịch sử đơn hàng</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">Đăng xuất</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link to="/login" className="text-white"><BiUserCircle size={28} /></Link>
              )}
            </div>

            {/* CART */}
            <Link to="/gio-hang" className="action-item cart-btn">
              <BiCart size={28} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </Container>
      </Navbar>

      <style>{`
        /* Luxury Dark Theme */
        .fixed-top { z-index: 1050; }
        .top-bar { background: #000; color: #888; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #1a1a1a; }
        .top-links a { color: #888; text-decoration: none; margin-left: 20px; transition: 0.3s; }
        .top-links a:hover { color: #ff6600; }
        
        .main-nav { background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(10px); }
        .accent-color { color: #ff6600; }
        .fw-black { font-weight: 900; letter-spacing: -0.5px; font-size: 1.4rem; color: #fff; text-decoration: none; }
        .logo-img { height: 35px; width: 35px; border-radius: 8px; filter: grayscale(20%); }

        .nav-links .nav-link { color: #aaa !important; font-size: 14px; font-weight: 500; transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
        .nav-links .nav-link:hover { color: #ff6600 !important; }

        /* Mega Menu */
        .mega-menu-trigger { position: static; cursor: pointer; color: #aaa; text-transform: uppercase; font-size: 14px; }
        .mega-menu-container {
          position: absolute; top: 100%; left: 0; width: 100%; 
          background: #111; border-bottom: 2px solid #ff6600;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 999;
          animation: slideUp 0.3s ease-out;
        }
        .mega-item { 
          display: flex; align-items: center; padding: 12px; 
          text-decoration: none; color: #ddd; border-radius: 8px; transition: 0.25s;
        }
        .mega-item:hover { background: #222; color: #ff6600; transform: translateX(5px); }
        .item-thumb { width: 40px; height: 40px; border-radius: 50%; margin-right: 15px; border: 1px solid #333; }
        .brand-item img { height: 30px; filter: grayscale(1) invert(1); opacity: 0.6; transition: 0.3s; }
        .brand-item:hover img { filter: grayscale(0) invert(0); opacity: 1; }

        /* Search & Actions */
        .search-group { position: relative; width: 220px; }
        .glass-input { 
          background: rgba(255,255,255,0.05) !important; border: 1px solid #333 !important;
          border-radius: 20px !important; color: #fff !important; font-size: 13px !important;
          padding-left: 35px !important; transition: 0.3s;
        }
        .glass-input:focus { width: 300px; border-color: #ff6600 !important; background: rgba(255,255,255,0.1) !important; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); border: none; background: none; color: #666; z-index: 5; }

        .action-item { color: #fff; position: relative; text-decoration: none; }
        .cart-count { 
          position: absolute; top: -5px; right: -8px; background: #ff6600;
          color: #fff; font-size: 10px; font-weight: bold; width: 18px; height: 18px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          border: 2px solid #0a0a0a;
        }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #ff6600; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 991px) {
          .mega-menu-container { position: relative; width: 100%; border: none; background: transparent; box-shadow: none; }
          .mega-item { padding: 8px 0; }
        }
      `}</style>
    </header>
  );
};

export default Header;