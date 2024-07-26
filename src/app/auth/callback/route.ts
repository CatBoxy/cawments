import { getToastRedirect } from "@/lib/utils";
import { createClient } from "../../../lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { handleUserLogin } from "@/lib/auth-helpers/server";

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/";

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getToastRedirect(
          `${requestUrl.origin}${redirectTo}`,
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
      `${requestUrl.origin}${redirectTo}`,
      "status",
      "Success!",
      "You are now signed in."
    )
  );
}
