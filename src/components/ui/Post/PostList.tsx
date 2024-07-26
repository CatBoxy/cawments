import React, { useEffect, useState } from "react";
import Post from "./Post";
import { User } from "@supabase/supabase-js";
//usar dinamic import ???

interface Post {
  id: string;
  user_id: string;
  content?: string | null;
  image_url?: string | null;
  created_at: string;
  parent_id?: string | null;
  user: {
    username: string;
    avatar_url: string;
  } | null;
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onLoadMore: () => void;
  handleNewComment: (formData: FormData) => void;
  user: User | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  onLoadMore,
  handleNewComment,
  user
}) => {
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    )
      return;
    onLoadMore();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      {!posts.length && (
        <div className="border-b border-zinc-700 p-4 flex justify-center">
          <p className="text-zinc-200">
            Nothing to show here yet. Add some content or come back later!
          </p>
        </div>
      )}
      {posts.map((post: Post) => (
        <Post
          key={post.id}
          post={post}
          handleNewComment={handleNewComment}
          user={user}
        />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default PostList;
