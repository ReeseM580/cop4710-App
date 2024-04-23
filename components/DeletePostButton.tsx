"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const DeletePostButton = ({ postId }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ post_id: postId });

    setIsDeleting(false);
    if (error) {
      console.error("Failed to delete post:", error.message);
      setDeleteError("Failed to delete post."); 
    } else {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return <p>Post deleted successfully.</p>; 
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className="text-white bg-transparent border border-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded">
      {isDeleting ? 'Deleting...' : 'Delete Post'}
    </button>
  );
};

export default DeletePostButton;
