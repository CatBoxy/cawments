import Post from "@/components/ui/Post/Post";
import CommentContainer from "@/components/ui/Comment/CommentContainer";
import { getPostById, getComments } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  const initialComments = await getComments(params.id, 10, 0);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main className="flex flex-col items-center">
      <Post post={post} redirect={false} handleNewComment={null} />
      <CommentContainer
        initialComments={initialComments}
        user={user}
        postId={post.id}
      />
    </main>
  );
}
