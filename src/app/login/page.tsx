import LogInButton from "@/components/LogInButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <div>
      <h1>LOG IN PAGE</h1>
      <LogInButton />
    </div>
  );
}
