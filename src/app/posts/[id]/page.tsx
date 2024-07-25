import { getPostById } from "@/lib/actions";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  console.log(post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>Post {post.id}</h1>
      <p>{post.content}</p>
    </div>
  );
}
