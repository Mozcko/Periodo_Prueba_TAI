import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar la contraseña
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append("username", username); 
    formData.append("password", password);

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(), // Convertir los datos a x-www-form-urlencoded
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Verificar si el token 'access_token' existe en la respuesta
      if (data.access_token) {
        // Guardar el token en el localStorage o sessionStorage
        localStorage.setItem("authToken", data.access_token);
        setSuccessMessage("Inicio de sesión exitoso, redirigiendo...");

        // Redirigir a la página principal después de 2 segundos
        setTimeout(() => {
          window.location.href = "/"; // Redirige a la página de inicio (index)
        }, 2000); // Esperar 2 segundos antes de redirigir
      } else {
        throw new Error("No se recibió access_token.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message); // Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Cambiar el estado para mostrar/ocultar la contraseña
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-700 p-8 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-white">Iniciar Sesión</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}{" "}
      {/* Mensaje de éxito */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-300 mb-2">
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
      </div>
      <div className="mb-4 relative">
        <label htmlFor="password" className="block text-gray-300 mb-2">
          Contraseña
        </label>
        <input
          type={showPassword ? "text" : "password"} // Mostrar u ocultar contraseña según el estado
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-500 rounded bg-gray-600 text-white"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
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
        {loading ? "Cargando..." : "Iniciar Sesión"}
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
