"use client";

import { createClient } from "../supabase/client";
import { type Provider } from "@supabase/supabase-js";
import { getURL } from "../utils";

export async function signInWithOAuth() {
  const provider: Provider = "github";

  const supabase = createClient();
  const redirectURL = getURL("/auth/callback");
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectURL
    }
  });
}
