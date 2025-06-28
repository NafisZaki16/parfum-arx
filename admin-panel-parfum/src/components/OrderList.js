import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function OrderList() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const ordersCollection = await getDocs(collection(db, 'orders'));
    const ordersData = ordersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'orders', id));
    fetchOrders(); // Refresh data
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#660000', color: 'white' }}>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama Produk</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Harga</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Alamat</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Metode</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.productName}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Rp {order.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.address}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.paymentMethod}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.status}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button onClick={() => handleDelete(order.id)} style={{ color: 'red' }}>
                  Hapus
                </button>
                {/* Tombol Edit bisa ditambahkan di sini */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
