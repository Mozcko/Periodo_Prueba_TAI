import React, { useState } from "react";

const SignInForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPasswordError("");
    setConfirmPasswordError("");
    setSuccessMessage("");
    setGeneralError("");

    const passwordValidationError = validatePassword(password);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError("");

    if (passwordValidationError) {
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            is_active: true, // Agregamos el campo is_active
          }),
        }
      );

      if (!response.ok) {
        // Si la respuesta no es 2xx, lanzamos un error con el mensaje recibido
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar la cuenta.");
      }

      const data = await response.json();
      // Si el registro es exitoso, muestra el mensaje de éxito y redirige
      setSuccessMessage("Registro exitoso, redirigiendo...");
      setTimeout(() => {
        window.location.href = "/login"; // Redirige al login
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      console.error("Error al registrar la cuenta:", error);
      setGeneralError(error.message || "Error desconocido"); // Mostrar mensaje de error general
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Cambiar el estado para mostrar/ocultar la contraseña
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState); // Cambiar el estado para mostrar/ocultar la contraseña
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-700 p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-white">Registrarse</h2>
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}
      {generalError && <div className="text-red-500 mb-4">{generalError}</div>}{" "}
      {/* Mostrar error general */}
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
      <div className="mb-4 relative">
        <label htmlFor="password" className="block text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        )}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-10 text-gray-400"
        >
          👁️
        </button>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
          Confirmar Contraseña
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
        {confirmPasswordError && (
          <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
        )}
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-10 text-gray-400"
        >
          👁️
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-500 transition-colors duration-300"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Registrarse"}
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
