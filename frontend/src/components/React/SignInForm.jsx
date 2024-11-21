// src/components/SignInForm.jsx
import React, { useState } from "react";

const SignInForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;

    if (password.length < minLength) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!hasNumber.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
    if (!hasLetter.test(password)) {
      return "La contraseña debe contener al menos una letra.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordValidationError = validatePassword(password);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError("");

    if (passwordValidationError) {
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    // TODO: agregar la lógica para manejar el registro
    console.log("Nombre:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-700 p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-white">Registrarse</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-300 mb-2">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
      </div>
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
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-500 transition-colors duration-300"
      >
        Registrarse
      </button>
      <p className="mt-4 text-gray-300 text-center">
        ¿Ya tienes una cuenta?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </form>
  );
};

export default SignInForm;
