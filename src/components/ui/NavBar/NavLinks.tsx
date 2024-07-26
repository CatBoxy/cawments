"use client";

import Link from "next/link";
import s from "./NavBar.module.css";
import { SignOut } from "@/lib/auth-helpers/server";
import Image from "next/image";
import LogInButton from "@/components/LogInButton";

interface NavlinksProps {
  user?: any;
}

export default function NavLinks({ user }: NavlinksProps) {
  return (
    <div className="relative flex flex-row justify-between pt-4 align-center">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} />
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
            Sign out
          </button>
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
}
