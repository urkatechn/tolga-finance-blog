import { Metadata } from "next";
import { PostEditor } from "../_components/post-editor";

export const metadata: Metadata = {
  title: "New Post | Admin Dashboard",
  description: "Create a new blog post",
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground">
          Create a new blog post with MDX content.
        </p>
      </div>
      
      <PostEditor />
    </div>
  );
}
