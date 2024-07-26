import PostContainer from "@/components/ui/Post/PostContainer";
import { getPosts } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function Home() {
  const initialPosts = await getPosts(10, 0);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>MAIN PAGE</h1>
      <PostContainer initialPosts={initialPosts} user={user} />
    </main>
  );
}
