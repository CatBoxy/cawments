"use client";

import React, { useEffect, useState } from "react";
import { getPosts } from "../lib/actions";
import Post from "./ui/Post/Post";

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

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const newPosts = await getPosts(10, offset);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setOffset((prevOffset) => prevOffset + 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    )
      return;
    fetchPosts();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      {!posts.length && <p>No posts found</p>}
      {posts.map((post: Post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default PostList;
