import { Metadata } from "next";
import { PostEditorV2 } from "../../_components/post-editor-v2";
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Edit Post | Admin Dashboard",
  description: "Edit an existing blog post",
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Fetch the actual post data
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug, color),
      author:authors(id, name, email, avatar_url)
    `)
    .eq('id', id)
    .single();
    
  if (error || !post) {
    notFound();
  }
  
  // Transform the data for the editor
  const initialData = {
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    category: post.category_id || '',
    author_id: post.author_id || '',
    coverImage: post.featured_image_url || '',
    tags: '',
  };

  return <PostEditorV2 postId={id} initialData={initialData} />;
}
