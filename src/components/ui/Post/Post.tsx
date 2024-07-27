"use client";

import { Card } from "../card";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { useRouter } from "next/navigation";
import DrawerDialog from "../DrawerDialog/drawerDialog";
import { User } from "@supabase/supabase-js";

interface PostProps {
  post: {
    id: string;
    user_id: string;
    content?: string | null;
    image_url?: string | null;
    created_at: string;
    parent_id?: string | null;
    user: {
      username: string;
      avatar_url: string;
    } | null;
  };
  redirect?: boolean;
  handleNewComment?: ((formData: FormData) => void) | null;
  user: User | null;
}

const Post: React.FC<PostProps> = ({
  post,
  redirect = true,
  handleNewComment,
  user
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (redirect) {
      router.push(`/posts/${post.id}`);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      onClick={handleCardClick}
      className="border-zinc-700 bg-zinc-950  border-b flex flex-col items-start gap-4 p-4 shadow-sm hover:bg-zinc-900 transition-shadow cursor-pointer"
    >
      <div className="flex w-full">
        <Avatar className="flex-shrink-0 h-12 w-12 rounded-full mr-4">
          <AvatarImage src={post.user?.avatar_url} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-zinc-200">
                {post.user?.username}
              </h4>
              <p className="text-sm text-muted-foreground text-zinc-200 break-words overflow-wrap-anywhere max-w-[500px] mb-4">
                {post.content}
              </p>
              {post.image_url && (
                <div className="mt-2 overflow-hidden rounded-lg">
                  <img
                    src={post.image_url}
                    alt="Post image"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {handleNewComment && (
        <div
          className="w-full flex flex-row justify-end"
          onClick={handleCommentClick}
        >
          <DrawerDialog
            post={post}
            handleNewComment={handleNewComment}
            user={user}
          />
        </div>
      )}
    </Card>
  );
};

export default Post;
