// src/pages/ProductsPage.js
import React from "react";
import ProductList from "../components/ProductList";

const ProductsPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>🛍️ Manajemen Produk</h1>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
