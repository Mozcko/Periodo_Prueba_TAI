// src/components/React/PostCard.jsx
import React from "react";

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

export default PostCard;
