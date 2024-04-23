"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { HeartIcon as HeartOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/solid";

const supabase = createClient();

const LikeButton = ({ postId }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const session = await supabase.auth.getSession();
            if (session.data?.session?.user) {
                setUserId(session.data.session.user.id);
                checkLikeStatus(session.data.session.user.id);
            }
        };

        fetchUserData();
        fetchLikesCount();
    }, []);

    const checkLikeStatus = async (userId) => {
        const { data: likes, error } = await supabase
            .from('likes')
            .select()
            .eq('post_id', postId)
            .eq('user_id', userId);

        if (!error && likes.length > 0) {
            setLiked(true);
        }
    };

    const fetchLikesCount = async () => {
        const { count, error } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', postId);

        if (!error) {
            setLikesCount(count);
        }
    };

    const toggleLike = async () => {
        if (!userId) return;

        if (liked) {
            await supabase
                .from('likes')
                .delete()
                .match({ post_id: postId, user_id: userId });
            setLikesCount(likesCount - 1);
        } else {
            await supabase
                .from('likes')
                .insert([{ post_id: postId, user_id: userId }]);
            setLikesCount(likesCount + 1);
        }

        setLiked(!liked);
    };

    return (
      <button onClick={toggleLike} className="like-button flex items-center justify-center bg-transparent border-0 p-0">
          {liked ? <HeartSolid className="h-6 w-6 text-red-500" /> : <HeartOutline className="h-6 w-6 text-gray-500" />}
          <span className="ml-2">{likesCount}</span>
      </button>
    );
  };

export default LikeButton;
