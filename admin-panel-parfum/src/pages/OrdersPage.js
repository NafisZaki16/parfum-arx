// src/pages/OrdersPage.js
import React from "react";
import OrderList from "../components/OrderList";

const OrdersPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Daftar Pesanan</h1>
      <OrderList />
    </div>
  );
};

export default OrdersPage;
