import PostContainer from "@/components/ui/Post/PostContainer";
import { getPosts, getUserData } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { Bird } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const initialPosts = await getPosts(10, 0);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let userData = null;
  if (user) {
    userData = await getUserData(user.id);
  }

  return (
    <main className="flex flex-col items-center">
      <div className="w-[600px] flex flex-col border-r border-l border-zinc-700 bg-zinc-950">
        <div className="p-4 border-zinc-700 border-b">
          <h1 className="flex justify-center text-zinc-200">
            <span className="mr-2">
              <Bird className="h-5 w-5" />
            </span>
            <span>Crow-sourced Conversations</span>
          </h1>
        </div>
        <PostContainer
          initialPosts={initialPosts}
          userData={userData}
          user={user}
        />
      </div>
    </main>
  );
}
