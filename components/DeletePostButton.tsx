"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const DeletePostButton = ({ postId }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const supabase = createClient();

  console

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ post_id: postId });

    setIsDeleting(false);
    if (error) {
      console.error("Failed to delete post:", error.message);
      setDeleteError("Failed to delete post."); // Handle error state and display message
    } else {
      setIsDeleted(true); // Set the flag that the post is deleted
    }
  };

  if (isDeleted) {
    return <p>Post deleted successfully.</p>; // Show a success message or render nothing
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      {isDeleting ? 'Deleting...' : 'Delete Post'}
    </button>
  );
};

export default DeletePostButton;