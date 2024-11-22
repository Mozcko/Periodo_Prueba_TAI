import React, { useState } from "react";

const PostCard = ({ post, onEdit, onDelete }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(post.image_url);
  const [imageFile, setImageFile] = useState(null); // Estado para manejar el archivo de imagen

  const handleEdit = async () => {
    const updatedData = new FormData();
    updatedData.append("title", title);
    updatedData.append("content", content);
    if (imageFile) {
      updatedData.append("image", imageFile); // Agregar archivo si se seleccionó
    }

    await onEdit(post.id, updatedData, true); // Llama a la función onEdit con FormData
    setIsPopupOpen(false);
  };

  const handleDelete = () => {
    onDelete(post.id);
    setIsPopupOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setImageFile(file); // Almacenar el archivo de la imagen
      setImage(imagePreview); // Actualizar la vista previa de la imagen
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <img
        src={`${import.meta.env.PUBLIC_API_ENDPOINT}/${post.image_url}`}
        alt="post image"
        className="w-full h-64 object-cover"
      />
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm mb-2">
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-500 text-sm mb-2">
          Created by: {post.created_by}
        </p>
      </div>
      <h2 className="text-3xl font-semibold">{post.title}</h2>
      <div className="space-y-2">
        <p>{post.content}</p>
      </div>
      <button onClick={() => setIsPopupOpen(true)} className="text-blue-500">
        Editar
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Post</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full mb-2 border border-gray-300 p-2"
              placeholder="Título"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full mb-2 border border-gray-300 p-2"
              placeholder="Contenido"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full mb-2 border border-gray-300 p-2"
            />
            {image && (
              <img
                src={image}
                alt="Vista previa"
                className="w-full h-64 object-cover mb-2"
              />
            )}
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Eliminar
            </button>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="text-gray-500 ml-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
