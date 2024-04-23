"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const EditPostButton = ({ postId, initialComment, onEditSuccess }) => {
    const [isEdited, setIsEdited] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState("");
    const [editedComment, setEditedComment] = useState(initialComment);

    const handleEdit = async () => {
        console.log(postId)
        setIsEditing(true);
        const supabase = createClient();

        const { data, error } = await supabase
            .from("posts")
            .update({ comment: editedComment })
            .match({ post_id: postId });

        setIsEditing(false);

        if (error) {
            console.error("Failed to edit post:", error.message);
            setEditError("Failed to edit post.");
        } else {
            setIsEdited(true);
            if (onEditSuccess) {
                onEditSuccess(data);
            }
        }
    };

    const handleChange = (event) => {
        setEditedComment(event.target.value);
        setIsEditing(true); // Enable editing when changes are made
    };


    if (isEdited) {
        return <p>Post edited successfully.</p>;
    }

    if (isEditing) {
        return (
            <div className="flex flex-col items-center">
                <input
                    type="text"
                    value={editedComment}
                    onChange={handleChange}
                    className="flex bg-black rounded-full
                border-white border
                hover:bg-gray-500 
                items-center
                hover:text-white 
                cursor-pointer 
                hover:opacity-80 
                p-1.5 my-3 gap-2"
                />
                <button
                    onClick={handleEdit}
                    className="text-white bg-transparent 
                    border border-green-500 
                    items-center hover:bg-green-500
                    hover:text-white font-bold 
                    py-2 px-4 rounded"
                >
                    Edit Post
                </button>
            </div>
        );
    } else {

        return (
            <button
                onClick={() => setIsEditing(true)}
                className="text-white bg-transparent 
                border border-green-500 
                hover:bg-green-500 hover:text-white 
                font-bold py-2 px-4 rounded"
            >
                Edit Post
            </button>
        );
    }
};

export default EditPostButton;