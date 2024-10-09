// src/app/signin/page.js
"use client";
import { useState } from "react";

export default function Signin() {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, secondName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        alert(errorData || "Erro inesperado.");
        return;
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert("Erro inesperado.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        placeholder="Second Name"
        onChange={(e) => setSecondName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
