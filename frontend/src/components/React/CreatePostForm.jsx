import React, { useState, useEffect } from "react";
// import PostCard from "./PostCard"; // Asegúrate de importar el componente PostCard

const PostCard = ({ title, content, createdAt, createdBy, image }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <img src={image} alt="post image" className="w-full h-64 object-cover" />
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm mb-2">
          {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm mb-2">Created by: {createdBy}</p>
      </div>
      <h2 className="text-3xl font-semibold">{title}</h2>

      <div className="space-y-2">
        <p>{content}</p>
      </div>
    </div>
  );
};

const CreatePostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(""); // Mensaje de error general

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // O la cookie correspondiente
    if (!token) {
      window.location.href = "/login"; // Redirigir a la página de login si no hay token
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setImage({ file, preview: imagePreview }); // Store the file and preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    if (!title || !content) {
      setGeneralError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    // Check if image is selected
    if (!image) {
      setGeneralError("Por favor selecciona una imagen.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setGeneralError("No se encontró el token de autorización.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image.file); // Append the file object directly

      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error detallado:", JSON.stringify(errorData, null, 2));
        setGeneralError(errorData.detail || "Error al crear el post.");
        throw new Error(errorData.detail || "Error al crear el post.");
      }

      // Mostrar toast de éxito
      showToast("Post creado exitosamente", "success");

      // Refrescar la página después de un breve retraso
      setTimeout(() => {
        window.location.reload(); // Recarga la página para ver los cambios
      }, 3000); // 3 segundos para mostrar el toast

      // Limpiar los campos
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el toast
  const showToast = (message, type) => {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add(
      "toast",
      "toast-top-right",
      "absolute",
      "z-50",
      "mt-16",
      "mr-4",
      "w-96",
      "bg-green-600",
      "text-white",
      "p-4",
      "rounded-lg",
      "shadow-lg",
      "transition",
      "duration-300",
      "opacity-0",
      "transform",
      "translate-x-12"
    );

    if (type === "error") {
      toast.classList.add("bg-red-600");
    }

    toast.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Mostrar animación
    setTimeout(() => {
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100", "translate-x-0");
    }, 50);

    // Desaparecer después de 3 segundos
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-x-0");
      toast.classList.add("opacity-0", "translate-x-12");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
  };

  return (
    <section id="create" className="py-8 flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full flex flex-col mb-4 md:mb-0">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Crear un nuevo Post
        </h2>
        {generalError && (
          <div className="text-red-500 mb-4">{generalError}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-6 rounded-lg shadow-md flex-grow"
        >
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="title"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="block w-full border border-gray-500 rounded-lg p-2 bg-gray-600 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="content"
            >
              Contenido
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="4"
              className="block w-full border border-gray-500 rounded-lg p-2 bg-gray-600 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="image"
            >
              Subir imagen
            </label>
            <input
              className="block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              aria-describedby="image"
              id="image"
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Post"}
          </button>
        </form>
      </div>

      <div className="md:w-1/2 md:pl-4 w-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-white">Previsualización</h2>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md flex-grow">
          <PostCard
            title={title || "Título del Post"}
            content={content || "Contenido del post..."}
            createdAt={new Date().toISOString()}
            createdBy="Juan Pérez"
            image={
              image
                ? image.preview
                : "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png"
            }
          />
        </div>
      </div>

      {/* Contenedor para los toasts */}
      <div id="toast-container" className="absolute top-0 left-0 right-0"></div>
    </section>
  );
};

export default CreatePostForm;
