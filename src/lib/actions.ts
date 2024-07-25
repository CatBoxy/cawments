"use server";

import { v4 as uuidv4 } from "uuid";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const text = formData.get("text") as string;
  const image = formData.get("image") as File | null;

  let imageUrl = "";
  if (image) {
    const uniqueFilename = `${uuidv4()}_${image.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(uniqueFilename, image);

    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    imageUrl = supabase.storage.from("images").getPublicUrl(uniqueFilename)
      .data.publicUrl;
  }

  const { error } = await supabase.from("Post").insert({
    user_id: user.id,
    content: text,
    image_url: imageUrl,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error creating post:", error);
  }
}

export async function createComment(formData: FormData, parentPostId: string) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const text = formData.get("text") as string;
  const image = formData.get("image") as File | null;

  let imageUrl = "";
  if (image) {
    const uniqueFilename = `${uuidv4()}_${image.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(uniqueFilename, image);

    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    imageUrl = supabase.storage.from("images").getPublicUrl(uniqueFilename)
      .data.publicUrl;
  }

  const { error } = await supabase.from("Post").insert({
    user_id: user.id,
    content: text,
    image_url: imageUrl,
    parent_post_id: parentPostId,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error creating comment:", error);
  }
}

export async function getPosts(limit = 10, offset = 0) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Post")
    .select(
      `
      *,
      user:User (
        username,
        avatar_url
      )
    `
    )
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
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}
