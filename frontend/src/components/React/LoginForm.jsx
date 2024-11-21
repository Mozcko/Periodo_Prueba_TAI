// src/components/LoginForm.jsx
import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: agregar la lógica para manejar el inicio de sesión
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-700 p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-white">Iniciar Sesión</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-300 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-500 transition-colors duration-300"
      >
        Iniciar Sesión
      </button>
      <p className="mt-4 text-gray-300 text-center">
        ¿No tienes una cuenta?{" "}
        <a href="/signin" className="text-blue-500 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
