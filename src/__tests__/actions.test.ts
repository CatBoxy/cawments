import {
  createPost,
  createComment,
  getPosts,
  getPostById,
  getComments
} from "../lib/actions";
import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

jest.mock("../lib/supabase/server");
jest.mock("next/navigation");

describe("actions", () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn()
      },
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn()
      },
      from: jest.fn().mockReturnThis(),
      insert: jest.fn(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } }
      });

      const formData = new FormData();
      formData.append("text", "Test post content");

      mockSupabase.insert.mockResolvedValue({ error: null });

      await createPost(formData);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          content: "Test post content"
        })
      );
    });

    it("should handle image upload", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } }
      });

      const formData = new FormData();
      formData.append("text", "Test post with image");
      formData.append(
        "image",
        new File([""], "test.jpg", { type: "image/jpeg" })
      );

      mockSupabase.storage.upload.mockResolvedValue({
        data: { path: "test.jpg" }
      });
      mockSupabase.storage.getPublicUrl.mockReturnValue({
        data: { publicUrl: "https://example.com/test.jpg" }
      });

      mockSupabase.insert.mockResolvedValue({ error: null });

      await createPost(formData);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          content: "Test post with image",
          image_url: "https://example.com/test.jpg"
        })
      );
    });

    it("should redirect if user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await createPost(new FormData());

      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("createComment", () => {
    it("should create a comment successfully", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } }
      });

      const formData = new FormData();
      formData.append("text", "Test comment content");
      formData.append("postId", "post123");

      mockSupabase.insert.mockResolvedValue({ error: null });

      await createComment(formData);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          content: "Test comment content",
          parent_id: "post123"
        })
      );
    });

    it("should handle image upload for comments", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user123" } }
      });

      const formData = new FormData();
      formData.append("text", "Test comment with image");
      formData.append("postId", "post123");
      formData.append(
        "image",
        new File([""], "test.jpg", { type: "image/jpeg" })
      );

      mockSupabase.storage.upload.mockResolvedValue({
        data: { path: "test.jpg" }
      });
      mockSupabase.storage.getPublicUrl.mockReturnValue({
        data: { publicUrl: "https://example.com/test.jpg" }
      });

      mockSupabase.insert.mockResolvedValue({ error: null });

      await createComment(formData);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "user123",
          content: "Test comment with image",
          parent_id: "post123",
          image_url: "https://example.com/test.jpg"
        })
      );
    });

    it("should redirect if user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await createComment(new FormData());

      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("getPosts", () => {
    it("should fetch posts successfully", async () => {
      const mockPosts = [{ id: "1", content: "Test post" }];
      mockSupabase.range.mockResolvedValue({ data: mockPosts, error: null });

      const result = await getPosts(10, 0);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.select).toHaveBeenCalledWith(expect.any(String));
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", {
        ascending: false
      });
      expect(mockSupabase.range).toHaveBeenCalledWith(0, 9);
      expect(result).toEqual(mockPosts);
    });

    it("should return an empty array on error", async () => {
      mockSupabase.range.mockResolvedValue({
        data: null,
        error: new Error("Database error")
      });

      const result = await getPosts(10, 0);

      expect(result).toEqual([]);
    });
  });

  describe("getPostById", () => {
    it("should fetch a single post successfully", async () => {
      const mockPost = { id: "1", content: "Test post" };
      mockSupabase.single.mockResolvedValue({ data: mockPost, error: null });

      const result = await getPostById("1");

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.select).toHaveBeenCalledWith(expect.any(String));
      expect(mockSupabase.eq).toHaveBeenCalledWith("id", "1");
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });

    it("should return null on error", async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: new Error("Post not found")
      });

      const result = await getPostById("1");

      expect(result).toBeNull();
    });
  });

  describe("getComments", () => {
    it("should fetch comments successfully", async () => {
      const mockComments = [{ id: "1", content: "Test comment" }];
      mockSupabase.range.mockResolvedValue({ data: mockComments, error: null });

      const result = await getComments("post1", 10, 0);

      expect(mockSupabase.from).toHaveBeenCalledWith("Post");
      expect(mockSupabase.select).toHaveBeenCalledWith(expect.any(String));
      expect(mockSupabase.eq).toHaveBeenCalledWith("parent_id", "post1");
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", {
        ascending: false
      });
      expect(mockSupabase.range).toHaveBeenCalledWith(0, 9);
      expect(result).toEqual(mockComments);
    });

    it("should return an empty array on error", async () => {
      mockSupabase.range.mockResolvedValue({
        data: null,
        error: new Error("Database error")
      });

      const result = await getComments("post1", 10, 0);

      expect(result).toEqual([]);
    });
  });
});
