// src/pages/LoginPage.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // Arahkan ke dashboard jika login berhasil
    } catch (err) {
      setError("Email atau password salah!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 30, border: "1px solid #ccc", borderRadius: 10 }}>
      <h2 style={{ marginBottom: 20 }}>Login Admin ARX+</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: 5
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#660000",
  color: "white",
  border: "none",
  borderRadius: 5
};

export default LoginPage;
