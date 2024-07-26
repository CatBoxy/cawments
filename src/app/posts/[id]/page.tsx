import Post from "@/components/ui/Post/Post";
import { getPostById } from "@/lib/actions";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main>
      <Post post={post} redirect={false} />
      {/* <h1>Post {post.id}</h1>
      <p>{post.content}</p> */}
    </main>
  );
}
