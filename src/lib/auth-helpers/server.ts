"use server";

import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { getURL } from "../utils";

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }
  return redirect(getURL("/login"));
}

export async function handleUserLogin() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user found");
  }

  const { data, error } = await supabase
    .from("User")
    .select("id")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
    throw new Error("Error checking user existence");
  }
  if (!data) {
    const { error: insertError } = await supabase.from("User").insert({
      id: user.id,
      username: user.user_metadata.user_name,
      avatar_url: user.user_metadata.avatar_url,
      created_at: new Date().toISOString()
    });
    if (insertError) {
      console.error("Error creating user:", insertError);
    }
  }
}
