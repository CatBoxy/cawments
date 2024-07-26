"use client";

import React, { useState } from "react";
import PostForm from "../Post/PostForm";
import PostList from "../Post/PostList";
import { createComment, getComments } from "@/lib/actions";
import { User } from "@supabase/supabase-js";

interface Comment {
  id: string;
  user_id: string;
  content?: string | null;
  image_url?: string | null;
  created_at: string;
  parent_id: string | null;
  user: {
    username: string;
    avatar_url: string;
  } | null;
}

interface CommentContainerProps {
  initialComments: Comment[];
  user: User | null;
  postId: string;
}

const CommentContainer: React.FC<CommentContainerProps> = ({
  initialComments,
  user,
  postId
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [offset, setOffset] = useState(initialComments.length);
  const [loading, setLoading] = useState(false);

  const handleNewComment = async (formData: FormData) => {
    formData.append("postId", postId);
    await createComment(formData);
    const newComments = await getComments(postId, 10, 0);
    setComments(newComments);
    setOffset(newComments.length);
  };

  const fetchMoreComments = async () => {
    setLoading(true);
    const newComments = await getComments(postId, 10, offset);
    setComments((prevComments) => [...prevComments, ...newComments]);
    setOffset((prevOffset) => prevOffset + newComments.length);
    setLoading(false);
  };

  return (
    <>
      {user && <PostForm onSubmit={handleNewComment} />}
      <PostList
        posts={comments}
        loading={loading}
        onLoadMore={fetchMoreComments}
        handleNewComment={handleNewComment}
      />
    </>
  );
};

export default CommentContainer;
