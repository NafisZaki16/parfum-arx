import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [productSummary, setProductSummary] = useState({});
  const [summary, setSummary] = useState({ totalIncome: 0, totalOrders: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const usersSnapshot = await getDocs(collection(db, "users"));
    const productsSnapshot = await getDocs(collection(db, "products"));

    const usersData = {};
    usersSnapshot.forEach((doc) => {
      usersData[doc.id] = doc.data();
    });
    setUsers(usersData);

    const productsData = {};
    productsSnapshot.forEach((doc) => {
      productsData[doc.id] = { id: doc.id, ...doc.data() };
    });
    setProducts(productsData);

    const ordersData = [];
    let totalIncome = 0;
    const productCounter = {};

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      ordersData.push({ id: doc.id, ...data });

      totalIncome += data.price || 0;

      const productName = data.productName;
      if (productCounter[productName]) {
        productCounter[productName] += 1;
      } else {
        productCounter[productName] = 1;
      }
    });

    setOrders(ordersData);
    setProductSummary(productCounter);
    setSummary({ totalIncome, totalOrders: ordersData.length });
  };

  // ✅ Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Laporan Penjualan", 14, 15);

    doc.setFontSize(12);
    doc.text(`Total Pendapatan: Rp ${summary.totalIncome.toLocaleString()}`, 14, 25);
    doc.text(`Total Pesanan: ${summary.totalOrders}`, 14, 32);

    // Tabel Stok
    doc.text("Stok Barang & Terjual", 14, 42);
    const stokData = Object.values(products).map((product) => {
      const sold = productSummary[product.name] || 0;
      const stock = product.stock || 0;
      return [product.name, stock, sold, stock - sold];
    });
    autoTable(doc, {
      head: [["Nama Produk", "Stok Awal", "Terjual", "Stok Sisa"]],
      body: stokData,
      startY: 46,
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Detail Pesanan", 14, finalY);
    const orderData = orders.map((order) => {
      const user = users[order.userId] || {};
      const tanggal = new Date(
        order.timestamp?.toDate?.() || order.timestamp
      ).toLocaleString();
      return [
        order.id,
        user.name || "-",
        order.address || user.address || "-",
        order.productName,
        `Rp ${order.price.toLocaleString()}`,
        order.status,
        order.paymentMethod,
        tanggal,
      ];
    });
    autoTable(doc, {
      head: [
        [
          "ID Pesanan",
          "Pelanggan",
          "Alamat",
          "Produk",
          "Harga",
          "Status",
          "Metode",
          "Tanggal",
        ],
      ],
      body: orderData,
      startY: finalY + 4,
    });

    doc.save("laporan-penjualan.pdf");
  };

  // ✅ Export CSV
  const handleExportCSV = () => {
    let csvContent = "";

    csvContent += "Ringkasan,,,\n";
    csvContent += `Total Pendapatan,${summary.totalIncome},,,\n`;
    csvContent += `Total Pesanan,${summary.totalOrders},,,\n\n`;

    csvContent += "Stok Barang,,,\n";
    csvContent += "Nama Produk,Stok Awal,Terjual,Stok Sisa\n";
    Object.values(products).forEach((product) => {
      const sold = productSummary[product.name] || 0;
      const stock = product.stock || 0;
      const remaining = stock - sold;
      csvContent += `${product.name},${stock},${sold},${remaining}\n`;
    });

    csvContent += "\n";

    csvContent += "Detail Pesanan,,,\n";
    csvContent += "ID Pesanan,Pelanggan,Alamat,Produk,Harga,Status,Metode,Tanggal\n";
    orders.forEach((order) => {
      const user = users[order.userId] || {};
      const tanggal = new Date(
        order.timestamp?.toDate?.() || order.timestamp
      ).toLocaleString();
      csvContent += `${order.id},${user.name || "-"},${order.address || user.address || "-"},${order.productName},${order.price},${order.status},${order.paymentMethod},${tanggal}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "laporan-penjualan.csv");
    link.click();
  };

  return (
    <div>
      <h1>📄 Laporan Penjualan</h1>

      {/* Tombol Export */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleExportPDF}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          🧾 Export PDF
        </button>

        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          📄 Export CSV
        </button>
      </div>

      {/* Ringkasan */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Ringkasan</h3>
        <p>Total Pendapatan: Rp {summary.totalIncome.toLocaleString()}</p>
        <p>Total Pesanan: {summary.totalOrders}</p>
      </div>

      {/* Stok Barang */}
      <div style={{ marginBottom: "20px" }}>
        <h3>📦 Stok Barang & Stok Keluar</h3>
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#660000", color: "white" }}>
            <tr>
              <th>Nama Produk</th>
              <th>Stok Awal</th>
              <th>Terjual</th>
              <th>Stok Sisa</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(products).map((product) => {
              const sold = productSummary[product.name] || 0;
              const stock = product.stock || 0;
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{stock}</td>
                  <td>{sold}</td>
                  <td>{stock - sold}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Pesanan */}
      <h3>📑 Detail Pesanan</h3>
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#660000", color: "white" }}>
          <tr>
            <th>ID Pesanan</th>
            <th>Pelanggan</th>
            <th>Alamat</th>
            <th>Produk</th>
            <th>Harga</th>
            <th>Status</th>
            <th>Metode</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const user = users[order.userId] || {};
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{user.name || "-"}</td>
                <td>{order.address || user.address || "-"}</td>
                <td>{order.productName}</td>
                <td>Rp {order.price.toLocaleString()}</td>
                <td>{order.status}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {new Date(
                    order.timestamp?.toDate?.() || order.timestamp
                  ).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
