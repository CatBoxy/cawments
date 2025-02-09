import { useCallback, useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { MessageCircle } from "lucide-react";

interface PostFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  userData: { username: string; avatar_url: string } | null;
  isComment?: boolean;
}

function PostForm({ onSubmit, userData, isComment }: PostFormProps) {
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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    if (newText.length <= 300) {
      setText(newText);
    }
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
            onChange={handleTextChange}
            placeholder="Create a new Cawment!"
          />
          <p className="text-sm text-zinc-400 mt-1 ml-4">{text.length}/300</p>
        </div>
        <div className="mb-4">
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
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-purple-900 hover:bg-purple-950"
            disabled={!isFormValid()}
          >
            <span className="mr-2">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span>{isComment ? "Comment" : "Post"}</span>
          </Button>
        </div>
      </form>
    </>
  );
}

export default PostForm;
