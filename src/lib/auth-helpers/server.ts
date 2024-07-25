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
