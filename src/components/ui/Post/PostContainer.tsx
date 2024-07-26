"use client";

import React, { useState } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";
import { createComment, createPost, getPosts } from "@/lib/actions";
import { User } from "@supabase/supabase-js";

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

interface PostContainerProps {
  initialPosts: Post[];
  user: User | null;
}

const PostContainer: React.FC<PostContainerProps> = ({
  initialPosts,
  user
}) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);

  const handleNewPost = async (formData: FormData) => {
    await createPost(formData);
    const newPosts = await getPosts(10, 0);
    setPosts(newPosts);
    setOffset(newPosts.length);
  };

  const handleNewComment = async (formData: FormData) => {
    await createComment(formData);
    const newPosts = await getPosts(10, 0);
    setPosts(newPosts);
    setOffset(newPosts.length);
  };

  const fetchMorePosts = async () => {
    setLoading(true);
    const newPosts = await getPosts(10, offset);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + newPosts.length);
    setLoading(false);
  };

  return (
    <>
      {user && <PostForm onSubmit={handleNewPost} />}
      <PostList
        posts={posts}
        loading={loading}
        onLoadMore={fetchMorePosts}
        handleNewComment={handleNewComment}
      />
    </>
  );
};

export default PostContainer;
