"use client";

import { createClient } from "../supabase/client";

export async function signInWithOAuth(redirectTo: string = "/") {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`
    }
  });
  if (error) throw error;
}
