import { useCallback, useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

interface PostFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  userData: { username: string; avatar_url: string } | null;
}

function PostForm({ onSubmit, userData }: PostFormProps) {
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
    await onSubmit(formData);
    setText("");
    setImage(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 border-b border-zinc-700">
        <div className="flex flex-row items-center mb-4">
          <Avatar className="flex-shrink-0 h-12 w-12 rounded-full mr-4">
            <AvatarImage src={userData?.avatar_url} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Input
            className="bg-zinc-900 border-zinc-700 border text-zinc-200"
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Create a new Cawment!"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="text" className="text-zinc-200">
            Upload an image:
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-purple-900 hover:bg-purple-950"
            disabled={!isFormValid()}
          >
            Post
          </Button>
        </div>
      </form>
    </>
  );
}

export default PostForm;
