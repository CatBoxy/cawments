"use client";

import Link from "next/link";
import s from "./NavBar.module.css";
import { SignOut } from "@/lib/auth-helpers/server";

interface NavlinksProps {
  user?: any;
}

export default function NavLinks({ user }: NavlinksProps) {
  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          LOGO
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/" className={s.link}>
            Cawments
          </Link>
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <button onClick={() => SignOut()} className={s.link}>
            logOut
          </button>
        ) : (
          <Link href="/login" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
