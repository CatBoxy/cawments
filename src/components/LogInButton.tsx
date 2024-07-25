"use client";

import { signInWithOAuth } from "@/lib/auth-helpers/client";
import React from "react";

function LogInButton() {
  return (
    <div>
      <button onClick={() => signInWithOAuth()}>LogIn</button>
    </div>
  );
}

export default LogInButton;
