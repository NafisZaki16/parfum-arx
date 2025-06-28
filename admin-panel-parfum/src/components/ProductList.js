import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    sizes: "",
    stock: "",
    image: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    sizes: "",
    stock: "",
    image: "",
  });

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(data);
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      sizes: JSON.stringify(product.sizes || {}),
      stock: product.stock || 0,
      image: product.image || "",
    });
  };

  const handleUpdate = async () => {
    const productRef = doc(db, "products", editId);
    await updateDoc(productRef, {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      sizes: JSON.parse(form.sizes || "{}"),
      stock: Number(form.stock),
      image: form.image,
    });
    setEditId(null);
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus produk?");
    if (confirm) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description,
        sizes: JSON.parse(newProduct.sizes || "{}"),
        stock: Number(newProduct.stock),
        image: newProduct.image,
      });
      alert("Produk berhasil ditambahkan");
      resetNewProduct();
      fetchProducts();
    } catch (error) {
      console.error("Error menambahkan produk: ", error);
      alert("Gagal menambahkan produk");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      sizes: "",
      stock: "",
      image: "",
    });
  };

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      price: "",
      description: "",
      sizes: "",
      stock: "",
      image: "",
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "0px" }}>

      {/* Tabel Produk */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "120px" }}>Nama</th>
            <th style={{ ...styles.th, width: "100px" }}>Harga</th>
            <th style={{ ...styles.th, width: "200px" }}>Deskripsi</th>
            <th style={{ ...styles.th, width: "150px" }}>Ukuran</th>
            <th style={{ ...styles.th, width: "80px" }}>Stok</th>
            <th style={{ ...styles.th, width: "100px" }}>Gambar</th>
            <th style={{ ...styles.th, width: "120px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              {/* Nama */}
              <td style={{ ...styles.td, width: "120px" }}>
                {editId === prod.id ? (
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                ) : (
                  prod.name
                )}
              </td>

              {/* Harga */}
              <td style={{ ...styles.td, width: "100px" }}>
                {editId === prod.id ? (
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                ) : (
                  `Rp ${prod.price}`
                )}
              </td>

              {/* Deskripsi */}
              <td style={{ ...styles.td, width: "200px" }}>
                {editId === prod.id ? (
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {prod.description}
                  </div>
                )}
              </td>

              {/* Ukuran */}
              <td style={{ ...styles.td, width: "150px" }}>
                {editId === prod.id ? (
                  <textarea
                    value={form.sizes}
                    onChange={(e) =>
                      setForm({ ...form, sizes: e.target.value })
                    }
                    style={{ width: "100%" }}
                  />
                ) : prod.sizes ? (
                  Object.entries(prod.sizes).map(([size, price]) => (
                    <div key={size}>
                      {size}: Rp {price}
                    </div>
                  ))
                ) : (
                  "-"
                )}
              </td>

              {/* Stok */}
              <td style={{ ...styles.td, width: "80px" }}>
                {editId === prod.id ? (
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                ) : (
                  prod.stock
                )}
              </td>

              {/* Gambar */}
              <td style={{ ...styles.td, width: "100px" }}>
                {editId === prod.id ? (
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                ) : prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={styles.image}
                  />
                ) : (
                  "-"
                )}
              </td>

              {/* Aksi */}
              <td style={{ ...styles.td, width: "120px" }}>
                {editId === prod.id ? (
                  <button style={styles.saveBtn} onClick={handleUpdate}>
                    Simpan
                  </button>
                ) : (
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(prod)}
                  >
                    Edit
                  </button>
                )}
                &nbsp;
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(prod.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Tambah Produk */}
      <h3 style={{ marginTop: "30px" }}>➕ Tambah Produk</h3>
      <div style={styles.formContainer}>
        <input
          placeholder="Nama"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Harga"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          placeholder="URL Gambar"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />
        <textarea
          placeholder="Deskripsi"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          rows={2}
        />
        <textarea
          placeholder='Ukuran (contoh: {"35ml":65000,"100ml":135000})'
          value={newProduct.sizes}
          onChange={(e) =>
            setNewProduct({ ...newProduct, sizes: e.target.value })
          }
          rows={2}
        />
        <input
          type="number"
          placeholder="Stok"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
        />
        <button style={styles.addBtn} onClick={handleAddProduct}>
          Tambah Produk
        </button>
      </div>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "1px solid #ccc",
  },
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#660000",
    color: "white",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
    verticalAlign: "top",
  },
  image: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  formContainer: {
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "400px",
    marginTop: "20px",
  },
  editBtn: {
    backgroundColor: "#28a745",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    border: "none",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addBtn: {
    backgroundColor: "#28a745",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default ProductList;
