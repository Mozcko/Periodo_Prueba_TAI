import React, { useState } from "react";
import PostCard from "./PostCard";

const CreatePostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: agregar la lógica para manejar la creación de un post
    console.log("Título:", title);
    console.log("Contenido:", content);
    console.log("Imagen:", image);
    setTitle("");
    setContent("");
    setImage(null);
  };

  return (
    <section id="create" className="py-8 flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full flex flex-col mb-4 md:mb-0">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Crear un nuevo Post
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-6 rounded-lg shadow-md flex-grow" // Usamos flex-grow para ocupar el espacio
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
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="image"
            >
              Subir imagen
            </label>
            <input
              class="block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
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
          >
            Crear Post
          </button>
        </form>
      </div>

      <div className="md:w-1/2 md:pl-4 w-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-white">Previsualización</h2>
        <div className="bg-gray-700 p-6 rounded-lg shadow-md flex-grow">
          {" "}
          {/* Usamos flex-grow aquí también */}
          <PostCard
            title={title || "Título del Post"}
            content={content || "Contenido del post..."}
            createdAt={new Date().toISOString()}
            createdBy="Juan Pérez"
            image={
              image ||
              "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.pngKK"
            } // Placeholder si no hay imagen
          />
        </div>
      </div>
    </section>
  );
};

export default CreatePostForm;
