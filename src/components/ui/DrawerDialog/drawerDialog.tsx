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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useState } from "react";
import { createComment } from "@/lib/actions";

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
}

const DrawerDialog: React.FC<DrawerDialogProps> = ({
  post,
  handleNewComment
}) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-purple-900 hover:bg-purple-950">Comment</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <Avatar className="flex-shrink-0 h-12 w-12 rounded-full">
              <AvatarImage src={post.user?.avatar_url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <DialogTitle>{post.user?.username} says</DialogTitle>
            <DialogDescription>{post.content}</DialogDescription>
          </DialogHeader>
          <CommentForm
            postId={post.id}
            handleNewComment={handleNewComment}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-purple-900 hover:bg-purple-950">Comment</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <Avatar className="flex-shrink-0 h-12 w-12 rounded-full">
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <DrawerTitle>{post.user?.username}</DrawerTitle>
          <DrawerDescription>{post.content}</DrawerDescription>
        </DrawerHeader>
        <CommentForm
          className="px-4"
          postId={post.id}
          handleNewComment={handleNewComment}
          setOpen={setOpen}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        {/* <Label htmlFor="comment">Comment</Label> */}
        <Input
          type="text"
          id="comment"
          placeholder="Post your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit">Comment</Button>
    </form>
  );
}
