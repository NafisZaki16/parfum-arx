// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const DashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchDashboardData = async () => {
    const usersSnap = await getDocs(collection(db, 'users'));
    const ordersSnap = await getDocs(collection(db, 'orders'));
    const productsSnap = await getDocs(collection(db, 'products'));

    setTotalUsers(usersSnap.size);
    setTotalOrders(ordersSnap.size);
    setTotalProducts(productsSnap.size);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📈 Dashboard</h1>
      <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
        <div style={{ flex: 1, padding: 20, background: '#660000', color: 'white', borderRadius: 12 }}>
          <h3>Total Pengguna</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalUsers}</p>
        </div>
        <div style={{ flex: 1, padding: 20, background: '#444', color: 'white', borderRadius: 12 }}>
          <h3>Total Pesanan</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalOrders}</p>
        </div>
        <div style={{ flex: 1, padding: 20, background: '#888', color: 'white', borderRadius: 12 }}>
          <h3>Total Produk</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
