"use client";

import { signInWithOAuth } from "@/lib/auth-helpers/client";
import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import AuthButton from "./ui/AuthButton/AuthButton";
import { createClient } from "@/lib/supabase/client";

function LogInButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsSubmitting(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await signInWithOAuth();
    } catch (error) {
      console.error("Error during sign in:", error);
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <AuthButton
        variant="slim"
        onClick={() => handleSubmit()}
        loading={isSubmitting}
      >
        <span className="mr-2">
          <Github className="h-5 w-5" />
        </span>
        <span>Sign In with GitHub</span>
      </AuthButton>
    </div>
  );
}

export default LogInButton;
