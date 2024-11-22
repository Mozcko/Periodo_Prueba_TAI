import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_API_ENDPOINT}/posts`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = async (id, updatedData, isFormData = false) => {
    try {
      const token = localStorage.getItem("authToken"); // Obtener el token de autorización

      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/posts/${id}`,
        {
          method: "PUT",
          headers: isFormData
            ? { Authorization: `Bearer ${token}` } // No se añaden headers de tipo si se usa FormData
            : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
          body: isFormData ? updatedData : JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el post.");
      }

      const updatedPost = await response.json();

      // Actualizar el estado local con el post actualizado
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, ...updatedPost } : post
        )
      );
    } catch (error) {
      console.error("Error al actualizar el post:", error);
      alert(error.message); // Mostrar un mensaje de error
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este post?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken"); // Obtener el token de autorización
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_ENDPOINT}/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el post.");
      }

      // Actualizar el estado local para eliminar el post de la UI
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      alert(error.message); // Mostrar un mensaje de error
    }
  };

  return (
    <section id="posts" className="py-8">
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default PostsSection;
