"use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

async function uploadImage(
  image: File | null,
  supabase: any
): Promise<string | null> {
  if (!image) return null;

  const uniqueFilename = `${uuidv4()}_${image.name}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(uniqueFilename, image);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  return supabase.storage.from("images").getPublicUrl(uniqueFilename).data
    .publicUrl;
}

export async function createPost(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const text = formData.get("text") as string | null;
  const image = formData.get("image") as File | null;

  const imageUrl = await uploadImage(image, supabase);

  const postData: any = {
    user_id: user.id,
    created_at: new Date().toISOString()
  };

  if (text) postData.content = text;
  if (imageUrl) postData.image_url = imageUrl;

  const { error } = await supabase.from("Post").insert(postData);

  if (error) {
    console.error("Error creating post:", error);
  }
}

export async function createComment(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const text = formData.get("text") as string;
  const image = formData.get("image") as File | null;
  const parentPostId = formData.get("postId") as string | null;

  const imageUrl = await uploadImage(image, supabase);

  const commentData: any = {
    user_id: user.id,
    parent_id: parentPostId,
    created_at: new Date().toISOString()
  };

  if (text) commentData.content = text;
  if (imageUrl) commentData.image_url = imageUrl;

  const { error } = await supabase.from("Post").insert(commentData);

  if (error) {
    console.error("Error creating comment:", error);
  }
}

export async function getPosts(limit = 10, offset = 0) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Post")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data;
}

export async function getPostById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Post")
    .select(POST_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

export async function getComments(postId: string, limit = 10, offset = 0) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Post")
    .select(POST_SELECT)
    .eq("parent_id", postId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data;
}

export async function getUserData(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("User")
    .select("username, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data;
}

const POST_SELECT = `
  *,
  user:User (
    username,
    avatar_url
  )
`;
