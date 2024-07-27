import Post from "@/components/ui/Post/Post";
import CommentContainer from "@/components/ui/Comment/CommentContainer";
import { getPostById, getComments, getUserData } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  const initialComments = await getComments(params.id, 10, 0);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let userData = null;
  if (user) {
    userData = await getUserData(user.id);
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main className="flex flex-col items-center">
      <div className="w-[600px] flex flex-col border-r border-l border-zinc-700 bg-zinc-950">
        <Post post={post} redirect={false} user={user} />
        <CommentContainer
          initialComments={initialComments}
          user={user}
          postId={post.id}
          userData={userData}
        />
      </div>
    </main>
  );
}
