import { Metadata } from "next";
import { PostEditorV2 } from "../../_components/post-editor-v2";

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
  // In a real app, fetch the post data here
  const mockInitialData = {
    title: `Sample Post ${params.id}`,
    slug: `sample-post-${params.id}`,
    excerpt: `This is a sample excerpt for post ${params.id}.`,
    content: `# Sample Post ${params.id}\n\nThis is sample content for editing.\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n\n### Code Example\n\n\`\`\`javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n\`\`\`\n\n> This is a blockquote\n\n![Sample Image](https://via.placeholder.com/800x400)`,
    category: "investing",
    status: "draft" as const,
    coverImage: "https://via.placeholder.com/1200x600",
    tags: "finance, investing, tips",
  };

  return <PostEditorV2 postId={params.id} initialData={mockInitialData} />;
}
