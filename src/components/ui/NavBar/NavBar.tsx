import { createClient } from "@/lib/supabase/server";
import s from "./NavBar.module.css";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <NavLinks user={user} />
      </div>
    </nav>
  );
}
