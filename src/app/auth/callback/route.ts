import { getToastRedirect, getURL } from "@/lib/utils";
import { createClient } from "../../../lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { handleUserLogin } from "@/lib/auth-helpers/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  console.log("requestUrl", requestUrl);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getToastRedirect(
          getURL("/login"),
          "error",
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
    await handleUserLogin();
  }

  return NextResponse.redirect(
    getToastRedirect(
      getURL("/"),
      "status",
      "Success!",
      "You are now signed in."
    )
  );
}
