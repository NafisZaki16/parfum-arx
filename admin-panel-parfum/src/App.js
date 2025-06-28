// src/App.js
import React, { useState, useEffect } from "react";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import DashboardPage from "./pages/dashboardPage";
import UsersPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import ReportPage from "./pages/ReportPage";
import { auth } from "./firebase";

function App() {
  const [page, setPage] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);
  const [hoveredButton, setHoveredButton] = useState(""); // State untuk hover

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setLoggedIn(false);
  };

  const renderPage = () => {
    switch (page) {
      case "orders":
        return <OrdersPage />;
      case "products":
        return <ProductsPage />;
      case "users":
        return <UsersPage />;
      case "report":
        return <ReportPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#660000",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: "20px", marginBottom: "30px" }}>
            🧴 ARX+ Admin
          </h2>
          {renderNavButton("dashboard", "Dashboard")}
          {renderNavButton("orders", "Pesanan")}
          {renderNavButton("products", "Produk")}
          {renderNavButton("users", "Pengguna Aktif")}
          {renderNavButton("report", "Laporan Penjualan")}
        </div>
        <button
          onClick={handleLogout}
          style={{
            ...navBtnStyle,
            marginTop: "auto",
            color: "#ffcccc",
            backgroundColor:
              hoveredButton === "logout" ? "#990000" : "transparent",
          }}
          onMouseEnter={() => setHoveredButton("logout")}
          onMouseLeave={() => setHoveredButton("")}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "30px" }}>{renderPage()}</main>
    </div>
  );

  // 🔥 Fungsi untuk membuat tombol nav dengan efek hover
  function renderNavButton(key, label) {
    const isActive = page === key;
    const isHovered = hoveredButton === key;
    return (
      <button
        onClick={() => setPage(key)}
        style={{
          ...navBtnStyle,
          backgroundColor: isActive
            ? "#990000"
            : isHovered
            ? "#800000"
            : "transparent",
          color: isActive || isHovered ? "#fff" : "white",
        }}
        onMouseEnter={() => setHoveredButton(key)}
        onMouseLeave={() => setHoveredButton("")}
      >
        {label}
      </button>
    );
  }
}

// ✅ Style tombol navigasi
const navBtnStyle = {
  background: "transparent",
  border: "none",
  color: "white",
  textAlign: "left",
  padding: "10px 12px",
  cursor: "pointer",
  fontSize: "16px",
  display: "block",
  width: "100%",
  marginBottom: "10px",
  borderRadius: "6px",
  transition: "background-color 0.2s ease",
};

export default App;
