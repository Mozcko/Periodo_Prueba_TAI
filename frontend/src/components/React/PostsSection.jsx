// src/components/React/PostsSection.jsx
import React from "react";
import PostCard from "./PostCard";

const PostsSection = () => {
  // TODO: agregar los post de forma asíncrona con fetch
  const posts = [
    {
      id: 1,
      image: "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
      title: "Título del Post 1",
      content: "Contenido del post 1. Lorem ipsum dolor sit amet.",
      createdAt: "2023-10-01T12:00:00Z",
      createdBy: "Juan Pérez",
    },
    {
      id: 2,
      image: "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
      title: "Título del Post 2",
      content: "Contenido del post 2. Lorem ipsum dolor sit amet.",
      createdAt: "2023-10-02T12:00:00Z",
      createdBy: "Juan Pérez",
    },
    {
      id: 3,
      image: "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
      title: "Título del Post 3",
      content: "Contenido del post 3. Lorem ipsum dolor sit amet.",
      createdAt: "2023-10-02T12:00:00Z",
      createdBy: "Juan Pérez",
    },
    {
      id: 4,
      image: "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
      title: "Título del Post 4",
      content: "Contenido del post 4. Lorem ipsum dolor sit amet.",
      createdAt: "2023-10-02T12:00:00Z",
      createdBy: "Juan Pérez",
    },
  ];

  return (
    <section id="posts" className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            createdAt={post.createdAt}
            createdBy={post.createdBy}
            image={post.image}
          />
        ))}
      </div>
    </section>
  );
};

export default PostsSection;
