import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";
import OrderSuccess from "./components/OrderSuccess";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container-fluid main-content mt-3 p-0" >
        <ChatPage/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham" element={<Products />} />
          <Route path="/san-pham/:slug" element={<ProductDetail />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tai-khoan" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
            } />
          
          
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
