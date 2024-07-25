import PostForm from "@/components/postForm";
import PostList from "@/components/PostList";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  return (
    <>
      <main>
        <h1>MAIN PAGE</h1>
        {user && <PostForm />}
        <PostList />
      </main>
    </>
  );
}
