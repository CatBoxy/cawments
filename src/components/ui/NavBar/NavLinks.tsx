"use client";

import Link from "next/link";
import s from "./NavBar.module.css";
import { SignOut } from "@/lib/auth-helpers/server";
import LogInButton from "@/components/LogInButton";
import { usePathname } from "next/navigation";

interface NavlinksProps {
  user?: any;
}

export default function NavLinks({ user }: NavlinksProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-row justify-between align-center">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 sm:h-16 sm:w-16" />
        </Link>
        <nav className="ml-6 space-x-2 lg:block hidden sm:block">
          <Link href="/" className={s.link}>
            Cawments
          </Link>
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <button onClick={() => SignOut(pathname)} className={s.link}>
            Sign out
          </button>
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
}
