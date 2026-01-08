import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { getHotProducts,getFeaturedProducts,getAllProducts } from "../api/productApi";
import HighlightSection from "../components/HighlightSection";
import SupportSection from "../components/SupportSection";
import { motion } from "framer-motion";

const Home = () => {
  const [products ,setProducts] = useState([]);
  const [productshot ,setProductsHot] = useState([]);
  const [productsSale ,setProductsSale] = useState([]);

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res));
    getHotProducts().then((res) => setProductsHot(res));
    getFeaturedProducts().then((res) => setProductsSale(res));
  }, []);
console.log(productshot);

  return (
    <>
      <Hero />

      <Container className="mt-2">
        <Row>
          <HighlightSection title="SẢN PHẨM HOT" products={productshot} />
          <HighlightSection title="SẢN PHẨM SALE" products={productsSale} />
          
          <h2>Tất cả sản phẩm</h2>
           {products.map((product) => (
          <motion.div key={product.id} className="carousel-card">
            <ProductCard item={product} />
          </motion.div>
        ))}

        <SupportSection/>
        </Row>
      </Container>
    </>
  );
};

export default Home;
