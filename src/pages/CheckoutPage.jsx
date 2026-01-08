import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const IMAGE_URL = "http://localhost:5000/uploads/products/";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

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
  }, []);

  const handleChange = (e) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });

  // Address API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  useEffect(() => {
    if (!customer.province) return;
    fetch(`https://provinces.open-api.vn/api/p/${customer.province}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts));
  }, [customer.province]);

  useEffect(() => {
    if (!customer.district) return;
    fetch(`https://provinces.open-api.vn/api/d/${customer.district}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards));
  }, [customer.district]);

  // Coupon
  const [couponList, setCouponList] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/coupons")
      .then((res) => res.json())
      .then(setCouponList)
      .catch(() => setCouponList([]));
  }, []);

  const subTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subTotal >= 200000 ? 0 : 30000;
  const total = subTotal + shippingFee - discount;

  const applyCouponFromSelect = (code) => {
    setCouponCode(code);
    const cp = couponList.data?.find((c) => c.code === code);
    if (!cp) return setDiscount(0);

    let value = 0;
    if (cp.type === "fixed") value = Number(cp.value);
    else value = Math.round(subTotal * Number(cp.value) / 100);

    setDiscount(value);
    Swal.fire("Áp dụng thành công!", `Giảm ${value.toLocaleString()} đ`, "success");
  };

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Submit order
  const submitOrder = async () => {
      if (
        !customer.name.trim() ||
        !customer.phone.trim() ||
        !customer.province ||
        !customer.district ||
        !customer.ward ||
        !customer.address.trim()
      ) {
        return Swal.fire(
          "Thiếu thông tin",
          "Vui lòng nhập đầy đủ thông tin giao hàng",
          "warning"
        );
      }
      if (!/^(0|\+84)[0-9]{9}$/.test(customer.phone)) {
        return Swal.fire("Số điện thoại không hợp lệ", "Vui lòng kiểm tra lại", "error");
      }
      if (cart.length === 0) {
        return Swal.fire("Giỏ hàng trống", "Không có sản phẩm để đặt hàng", "warning");
      }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: `${customer.address}, ${customer.ward}, ${customer.district}, ${customer.province}`,
            note: customer.note,
          },
          items: cart.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            product_name: i.product_name,
            color: i.color,
            power: i.power,
            price: i.price,
            quantity: i.quantity,
            total: i.price * i.quantity,
          })),
          subTotal,
          shippingFee,
          discount,
          total,
          coupon_code: couponCode,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        clearCart();
        navigate("/order-success");
      } else {
        Swal.fire("Lỗi", data.message, "error");
      }
    } catch {
      setLoading(false);
      Swal.fire("Lỗi", "Không thể đặt hàng", "error");
    }
  };

  return (
    <div className="checkout-page container my-4">

      {/* Spinner overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
            color: "#fff",
          }}
        >
          <div className="spinner-border text-light" role="status" style={{ width: "4rem", height: "4rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <div style={{ marginTop: "15px", fontSize: "1.2rem" }}>Đang xử lý đơn hàng...</div>
        </div>
      )}

      <h3 className="fw-bold mb-4">Thanh toán đơn hàng</h3>
      <div className="row g-4">
        {/* LEFT FORM */}
        <div className="col-lg-7">
          {/* Shipping Info */}
          <div className="checkout-card p-4 bg-white rounded shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Thông tin giao hàng</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input className="form-control" name="name" placeholder="Họ tên"
                  value={customer.name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <input className="form-control" name="phone" placeholder="Số điện thoại"
                  value={customer.phone} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <input className="form-control" name="email" placeholder="Email"
                  value={customer.email} onChange={handleChange} />
              </div>
            </div>

            {/* Address */}
            <div className="row g-3 mt-1">
              <div className="col-md-4">
                <select className="form-select" name="province" onChange={handleChange}>
                  <option value="">Chọn tỉnh</option>
                  {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" name="district" onChange={handleChange}>
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" name="ward" onChange={handleChange}>
                  <option value="">Chọn Phường</option>
                  {wards.map((w) => <option key={w.code} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <textarea
                    className="form-control"
                    name="note"
                    rows="2"
                    placeholder="Ghi chú cho đơn hàng"
                    value={customer.note}
                    onChange={handleChange}
                  />
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="checkout-card p-4 bg-white rounded shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Mã giảm giá</h5>
            <select className="form-select" value={couponCode}
              onChange={(e) => applyCouponFromSelect(e.target.value)}>
              <option value="">-- Chọn mã giảm giá --</option>
              {couponList.data?.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} ({c.type === "fixed"
                    ? `Giảm ${Number(c.value).toLocaleString()} đ`
                    : `Giảm ${c.value}%`})
                </option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div className="checkout-card p-4 bg-white rounded shadow-sm mb-4">
            <h5 className="fw-bold mb-3">Hình thức thanh toán</h5>
            <div className="payment-options d-flex gap-3">
              <button
                className={`pay-btn ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                Thanh toán khi nhận hàng
              </button>
              <button
                className={`pay-btn vnpay ${paymentMethod === "vnpay" ? "active" : ""}`}
                onClick={() => setPaymentMethod("vnpay")}
              >
                VNPAY
              </button>
              <button
                className={`pay-btn momo ${paymentMethod === "momo" ? "active" : ""}`}
                onClick={() => setPaymentMethod("momo")}
              >
                MOMO
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="col-lg-5">
          <div className="checkout-card p-4 bg-white rounded shadow-sm">
            <h5 className="fw-bold mb-3">Đơn hàng</h5>
            {cart.map((item) => (
              <div key={item.variant_id} className="d-flex mb-3 pb-2 border-bottom">
                <img src={IMAGE_URL + item.image} width="70" height="70" className="rounded" />
                <div className="ms-3 flex-grow-1">
                  <b>{item.product_name}</b>
                  <p className="small text-muted mb-1">{item.color} – {item.power}</p>
                  <p className="fw-bold text-danger">{item.price.toLocaleString()} x {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="summary mt-3">
              <div className="d-flex justify-content-between mb-2"><span>Tạm tính:</span><b>{subTotal.toLocaleString()} đ</b></div>
              <div className="d-flex justify-content-between mb-2"><span>Giảm giá:</span><b className="text-success">-{discount.toLocaleString()} đ</b></div>
              <div className="d-flex justify-content-between mb-2"><span>Phí ship:</span><b>{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString() + " đ"}</b></div>
              <hr />
              <div className="d-flex justify-content-between mb-3"><h5 className="fw-bold">Tổng cộng:</h5><h5 className="fw-bold text-danger">{total.toLocaleString()} đ</h5></div>
              <button className="btn btn-danger w-100 py-2 fw-bold" onClick={submitOrder}>Đặt hàng ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
