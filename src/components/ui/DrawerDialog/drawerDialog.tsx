import * as React from "react";

import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useCallback, useState } from "react";
import { User } from "@supabase/supabase-js";
import LogInButton from "@/components/LogInButton";
import { MessageCircle } from "lucide-react";
import { Label } from "../label";

interface DrawerDialogProps {
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
  handleNewComment: (formData: FormData) => void;
  user: User | null;
}

const DrawerDialog: React.FC<DrawerDialogProps> = ({
  post,
  handleNewComment,
  user
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-purple-900 hover:bg-purple-950">
            <span className="mr-2">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span>Comment</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-600">
          {user ? (
            <div>
              <DialogHeader>
                <div className="flex flex-row items-center">
                  <Avatar className="flex-shrink-0 h-12 w-12 rounded-full mr-4">
                    <AvatarImage src={post.user?.avatar_url} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <DialogTitle className="font-semibold text-zinc-200">
                    {post.user?.username}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm text-muted-foreground text-zinc-200 break-words overflow-wrap-anywhere py-4 sm:max-w-[370px]">
                  {post.content}
                  {post.image_url && (
                    <div className="mt-2 overflow-hidden rounded-lg">
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <CommentForm
                postId={post.id}
                handleNewComment={handleNewComment}
                setOpen={setOpen}
              />
            </div>
          ) : (
            <LogInButton />
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-purple-900 hover:bg-purple-950">
          <span className="mr-2">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span>Comment</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-950 border-zinc-600">
        {user ? (
          <div>
            <DrawerHeader className="text-left">
              <div className="flex flex-row items-center">
                <Avatar className="flex-shrink-0 h-12 w-12 rounded-full mr-4">
                  <AvatarImage src={post.user?.avatar_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <DrawerTitle className="font-semibold text-zinc-200">
                  {post.user?.username}
                </DrawerTitle>
              </div>
              <DrawerDescription className="text-sm text-muted-foreground text-zinc-200 break-words overflow-wrap-anywhere py-4 max-w-[330px]">
                {post.content}
                {post.image_url && (
                  <div className="mt-2 overflow-hidden rounded-lg h-auto w-32">
                    <img
                      src={post.image_url}
                      alt="Post image"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </DrawerDescription>
            </DrawerHeader>
            <CommentForm
              className="px-4"
              postId={post.id}
              handleNewComment={handleNewComment}
              setOpen={setOpen}
            />
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <LogInButton />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerDialog;

interface CommentFormProps extends React.ComponentProps<"form"> {
  postId: string;
  handleNewComment: (formData: FormData) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CommentForm({
  className,
  postId,
  handleNewComment,
  setOpen
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const isFormValid = useCallback(() => {
    return text.trim() !== "" || image !== null;
  }, [text, image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }
    formData.append("postId", postId);
    await handleNewComment(formData);
    setText("");
    setImage(null);
    (e.target as HTMLFormElement).reset();
    setOpen(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    if (newText.length <= 300) {
      setText(newText);
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <div className="flex">
          <Input
            type="text"
            id="comment"
            placeholder="Reply with your comment"
            value={text}
            onChange={handleTextChange}
            className="bg-zinc-900 border-zinc-700 border text-zinc-200"
          />
          <p className="text-sm text-zinc-400 ml-4 flex items-center">
            {text.length}/300
          </p>
        </div>
        <Label htmlFor="image" className="text-zinc-200">
          Upload an image:
        </Label>
        <Input
          className="bg-zinc-900 border-zinc-700 border text-zinc-200 cursor-pointer"
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>
      <Button
        type="submit"
        className="bg-purple-900 hover:bg-purple-950"
        disabled={!isFormValid()}
      >
        <span className="mr-2">
          <MessageCircle className="h-5 w-5" />
        </span>
        Comment
      </Button>
    </form>
  );
}
