import { Metadata } from "next";
import { PostEditorV2 } from "../_components/post-editor-v2";

export const metadata: Metadata = {
  title: "New Post | Admin Dashboard",
  description: "Create a new blog post",
};

export default function NewPostPage() {
  return <PostEditorV2 />;
}
