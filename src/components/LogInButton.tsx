"use client";

import { signInWithOAuth } from "@/lib/auth-helpers/client";
import React from "react";
import { Button } from "./ui/button";

function LogInButton() {
  return (
    <div>
      <Button onClick={() => signInWithOAuth()}>LogIn</Button>
    </div>
  );
}

export default LogInButton;
