import { Metadata } from "next";
import { PostEditor } from "../../_components/post-editor";

export const metadata: Metadata = {
  title: "Edit Post | Admin Dashboard",
  description: "Edit an existing blog post",
};

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">
          Edit post ID: {params.id}
        </p>
      </div>
      
      <PostEditor postId={params.id} />
    </div>
  );
}
