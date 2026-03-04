import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTruck, FaTicketAlt, FaCreditCard, FaChevronLeft, FaShieldAlt } from "react-icons/fa";

const IMAGE_URL = "http://localhost:20032/uploads/products/";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "", phone: "", email: "", address: "",
    province: "", district: "", ward: "", note: "",
  });

  // Address State
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Coupon & Payment State
  const [couponList, setCouponList] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setCustomer((prev) => ({
        ...prev,
        name: savedUser.name || "",
        phone: savedUser.phone || "",
        email: savedUser.email || "",
        address: savedUser.address || "",
      }));
    }
    
    // Fetch Provinces & Coupons
    fetch("https://provinces.open-api.vn/api/p/").then(res => res.json()).then(setProvinces);
    fetch("http://localhost:20032/api/coupons").then(res => res.json()).then(setCouponList).catch(() => setCouponList([]));
  }, []);

  // API Địa lý logic (Province -> District -> Ward)
  useEffect(() => {
    if (!customer.province) return;
    fetch(`https://provinces.open-api.vn/api/p/${customer.province}?depth=2`)
      .then(res => res.json()).then(data => setDistricts(data.districts));
  }, [customer.province]);

  useEffect(() => {
    if (!customer.district) return;
    fetch(`https://provinces.open-api.vn/api/d/${customer.district}?depth=2`)
      .then(res => res.json()).then(data => setWards(data.wards));
  }, [customer.district]);

  const handleChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const subTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subTotal >= 2000000 ? 0 : 35000;
  const total = subTotal + shippingFee - discount;

  const applyCoupon = (code) => {
    setCouponCode(code);
    if (!code) return setDiscount(0);
    const cp = couponList.data?.find((c) => c.code === code);
    if (!cp) return setDiscount(0);
    const value = cp.type === "fixed" ? Number(cp.value) : Math.round((subTotal * Number(cp.value)) / 100);
    setDiscount(value);
    Swal.fire({ title: "Đã áp dụng!", text: `Bạn được giảm ${value.toLocaleString()}đ`, icon: "success", timer: 1500, showConfirmButton: false });
  };

const submitOrder = async () => {
  if (!customer.name || !customer.phone || !customer.ward || !customer.address) {
    return Swal.fire(
      "Thiếu thông tin",
      "Vui lòng nhập đầy đủ địa chỉ giao hàng",
      "warning"
    );
  }

  if (cart.length === 0) {
    return Swal.fire("Giỏ hàng trống", "", "warning");
  }

  try {
    setLoading(true);

    const orderData = {
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: `${customer.address}, ${customer.ward}, ${customer.district}, ${customer.province}`,
      },

      items: cart.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        color: item.color,
        power: item.power,
        connection_type: item.connection_type,
        has_microphone: item.has_microphone,
        quantity: item.quantity,
        price: item.price,
      })),

      subTotal: subTotal,
      shippingFee: shippingFee,
      discount: discount,
      total: total,

      coupon_code: couponCode || null,
      payment_method: paymentMethod,
      note: customer.note || "",
    };

    console.log("🚀 Gửi order:", orderData);

    const res = await fetch(
      "http://localhost:20032/api/orders/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    Swal.fire({
      icon: "success",
      title: "Đặt hàng thành công 🎉",
      text: "Đơn hàng đang được xử lý",
      timer: 2000,
      showConfirmButton: false,
    });

    clearCart();

    navigate("/order-success", {
      state: {
        orderId: data.order_id,
      },
    });

  } catch (err) {
    console.error(err);

    Swal.fire(
      "Lỗi đặt hàng",
      err.message || "Không thể tạo đơn",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="checkout-wrapper pb-5" style={{marginTop:100}}>
      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-overlay">
            <div className="soundwave-loader">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <p>Đang bảo mật giao dịch...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mt-4">
        <Link to="/cart" className="text-decoration-none text-secondary small d-flex align-items-center mb-4">
          <FaChevronLeft className="me-2" /> QUAY LẠI GIỎ HÀNG
        </Link>

        <div className="row g-4">
          {/* CỘT TRÁI: THÔNG TIN */}
          <div className="col-lg-7">
            <div className="checkout-section-card">
              <div className="section-header">
                <FaTruck className="accent-icon" />
                <h5>THÔNG TIN GIAO HÀNG</h5>
              </div>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="floating-input">
                    <input name="name" placeholder="Họ và tên" value={customer.name} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="floating-input">
                    <input name="phone" placeholder="Số điện thoại" value={customer.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-12">
                  <div className="floating-input">
                    <input name="email" placeholder="Email (nhận thông tin đơn hàng)" value={customer.email} onChange={handleChange} />
                  </div>
                </div>
                
                {/* SELECT ĐỊA CHỈ */}
                <div className="col-md-4">
                  <select className="custom-select" name="province" onChange={handleChange}>
                    <option value="">Tỉnh/Thành</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="custom-select" name="district" onChange={handleChange}>
                    <option value="">Quận/Huyện</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="custom-select" name="ward" onChange={handleChange}>
                    <option value="">Phường/Xã</option>
                    {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <div className="floating-input">
                    <input name="address" placeholder="Số nhà, tên đường..." value={customer.address} onChange={handleChange} />
                  </div>
                </div>
                <div className="col-12">
                  <textarea className="custom-textarea" name="note" rows="2" placeholder="Ghi chú thêm (Ví dụ: Giao giờ hành chính)" onChange={handleChange}></textarea>
                </div>
              </div>
            </div>

            <div className="checkout-section-card mt-4">
              <div className="section-header">
                <FaCreditCard className="accent-icon" />
                <h5>PHƯƠNG THỨC THANH TOÁN</h5>
              </div>
              <div className="payment-grid">
                {[
                  { id: "cod", label: "COD", desc: "Thanh toán khi nhận hàng" },
                  { id: "vnpay", label: "VNPAY", desc: "Cổng thanh toán VnPay" },
                  { id: "momo", label: "MOMO", desc: "Ví điện tử MoMo" }
                ].map(method => (
                  <div 
                    key={method.id}
                    className={`payment-item ${paymentMethod === method.id ? "active" : ""}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="radio-circle"></div>
                    <div>
                      <div className="fw-bold">{method.label}</div>
                      <div className="small opacity-50">{method.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT */}
          <div className="col-lg-5">
            <div className="summary-sticky-card">
              <h5 className="fw-bold mb-4">TÓM TẮT ĐƠN HÀNG</h5>
              
              <div className="product-list-mini hide-scrollbar">
                {cart.map((item) => (
                  <div key={item.variant_id} className="mini-product-item">
                    <div className="img-wrapper">
                      <img src={IMAGE_URL + item.image} alt={item.product_name} />
                      <span className="qty-badge">{item.quantity}</span>
                    </div>
                    <div className="info">
                      <div className="name">{item.product_name}</div>
                      <div className="variant">{item.color} / {item.power}</div>
                    </div>
                    <div className="price">{(item.price * item.quantity).toLocaleString()}đ</div>
                  </div>
                ))}
              </div>

              <div className="coupon-box mt-4">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0"><FaTicketAlt className="text-orange" /></span>
                  <select className="form-select border-start-0" onChange={(e) => applyCoupon(e.target.value)}>
                    <option value="">Chọn mã giảm giá</option>
                    {couponList.data?.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - Giảm {c.type === 'fixed' ? c.value.toLocaleString() + 'đ' : c.value + '%'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="billing-details mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Tạm tính</span>
                  <span>{subTotal.toLocaleString()}đ</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString() + "đ"}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                )}
                <hr className="my-3 opacity-10" />
                <div className="d-flex justify-content-between align-items-end">
                  <span className="fw-bold">TỔNG CỘNG</span>
                  <div className="text-end">
                    <div className="total-amount">{total.toLocaleString()}đ</div>
                    <div className="small text-secondary">(Đã bao gồm VAT)</div>
                  </div>
                </div>
              </div>

              <button className="btn-checkout-final mt-4" onClick={submitOrder} disabled={loading}>
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
              </button>
              
              <div className="secure-tag mt-3">
                <FaShieldAlt className="me-2" /> Thanh toán an toàn và bảo mật 100%
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-wrapper { background: #f8f9fa; min-height: 100vh; color: #1a1a1a; }
        .text-orange { color: #ff6600; }
        
        /* Section Cards */
        .checkout-section-card { background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); }
        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
        .section-header h5 { margin: 0; font-weight: 800; letter-spacing: 1px; }
        .accent-icon { color: #ff6600; font-size: 1.2rem; }

        /* Form Inputs */
        .floating-input input, .custom-select, .custom-textarea {
          width: 100%; padding: 12px 15px; border: 1px solid #eee; border-radius: 12px;
          background: #fbfbfb; transition: 0.3s; outline: none;
        }
        .floating-input input:focus, .custom-select:focus { border-color: #ff6600; background: #fff; }

        /* Payment Grid */
        .payment-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .payment-item { 
          display: flex; align-items: center; gap: 15px; padding: 15px; 
          border: 1px solid #eee; border-radius: 15px; cursor: pointer; transition: 0.3s;
        }
        .payment-item.active { border-color: #ff6600; background: rgba(255,102,0,0.02); }
        .radio-circle { width: 18px; height: 18px; border: 2px solid #ddd; border-radius: 50%; position: relative; }
        .payment-item.active .radio-circle { border-color: #ff6600; }
        .payment-item.active .radio-circle::after {
          content: ''; position: absolute; width: 10px; height: 10px; 
          background: #ff6600; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        /* Summary Card */
        .summary-sticky-card { background: #fff; padding: 30px; border-radius: 20px; position: sticky; top: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .mini-product-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .img-wrapper { position: relative; width: 60px; height: 60px; flex-shrink: 0; }
        .img-wrapper img { width: 100%; height: 100%; border-radius: 10px; object-fit: cover; border: 1px solid #eee; }
        .qty-badge {
          position: absolute; top: -8px; right: -8px; background: #ff6600; color: #fff;
          width: 20px; height: 20px; border-radius: 50%; font-size: 10px;
          display: flex; align-items: center; justify-content: center; font-weight: bold;
        }
        .info .name { font-size: 13px; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .info .variant { font-size: 11px; color: #888; }
        .price { margin-left: auto; font-size: 13px; font-weight: 700; }

        .total-amount { font-size: 24px; font-weight: 900; color: #ff6600; line-height: 1; }
        .btn-checkout-final {
          width: 100%; background: #111; color: #fff; border: none; padding: 18px;
          border-radius: 15px; font-weight: 800; letter-spacing: 1px; transition: 0.3s;
        }
        .btn-checkout-final:hover { background: #ff6600; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,102,0,0.2); }
        
        .secure-tag { display: flex; align-items: center; justify-content: center; font-size: 12px; color: #28a745; font-weight: 600; }

        /* Loader */
        .loading-overlay {
          position: fixed; inset: 0; background: rgba(255,255,255,0.9);
          z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .soundwave-loader { display: flex; align-items: center; gap: 5px; height: 40px; margin-bottom: 20px; }
        .soundwave-loader span { width: 4px; height: 10px; background: #ff6600; border-radius: 10px; animation: wave 1s infinite ease-in-out; }
        .soundwave-loader span:nth-child(2) { animation-delay: 0.1s; }
        .soundwave-loader span:nth-child(3) { animation-delay: 0.2s; }
        .soundwave-loader span:nth-child(4) { animation-delay: 0.3s; }
        .soundwave-loader span:nth-child(5) { animation-delay: 0.4s; }
        @keyframes wave { 0%, 100% { height: 10px; } 50% { height: 40px; } }
      `}</style>
    </div>
  );
};

export default CheckoutPage;