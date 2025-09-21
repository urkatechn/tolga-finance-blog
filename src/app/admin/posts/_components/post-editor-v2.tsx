"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./editor-styles.css";
import rehypeSanitize from "rehype-sanitize";
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, X, ImageIcon } from "lucide-react";
import NextImage from 'next/image';
import { MediaPicker } from '@/components/admin/media-picker';

// Dynamically import the editor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

// Define the form schema with zod - more lenient for drafts
const formSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
});

//Inferring typescript type from zod object
type FormValues = z.infer<typeof formSchema>;

// Category interface
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

// Author interface
interface Author {
  id: string;
  name: string;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_default: boolean;
}

interface PostEditorV2Props {
  postId?: string;
  initialData?: Partial<FormValues> & { author_id?: string };
}

export function PostEditorV2({ postId, initialData }: PostEditorV2Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [activeTab, setActiveTab] = useState("metadata");
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [defaultAuthorId, setDefaultAuthorId] = useState<string>('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | 'content'>('cover');
  const { toast } = useToast();

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch authors from API
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await fetch('/api/authors');
      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast({
        title: "Error",
        description: "Failed to load authors",
        variant: "destructive",
      });
    } finally {
      setLoadingAuthors(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch default settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setDefaultAuthorId(data.default_author_id || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Don't show error toast for settings as it's not critical
    }
  };

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      author: initialData?.author_id || "",
      coverImage: initialData?.coverImage || "",
      tags: initialData?.tags || "",
      featured: (initialData as typeof initialData & { featured?: boolean })?.featured || false,
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCategories(), fetchAuthors(), fetchSettings()]);
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set author: use existing author for edits, or default author for new posts
  useEffect(() => {
    if (postId) {
      // For editing existing posts, use the post's current author
      if (initialData?.author_id) {
        form.setValue('author', initialData.author_id);
      }
    } else {
      // For new posts, use default author if no author is selected
      if (defaultAuthorId && !form.getValues('author')) {
        form.setValue('author', defaultAuthorId);
      }
    }
  }, [defaultAuthorId, form, postId, initialData?.author_id]);

  // Update form content when editor changes
  useEffect(() => {
    form.setValue("content", content);
  }, [content, form]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    
    // Only auto-generate slug if it's empty or was auto-generated before
    const currentTitle = form.getValues("title") || "";
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(currentTitle)) {
      form.setValue("slug", generateSlug(title));
    }
  };

  // Handle image upload
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      // Fallback to data URL if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle image paste in the editor
  const handleImagePaste = useCallback(async (dataTransfer: DataTransfer | null): Promise<string | void> => {
    if (!dataTransfer) return;
    
    const files = Array.from(dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      return await uploadImage(imageFile);
    }
  }, []);

  // Handle media picker selection
  const handleMediaSelect = (file: { id: string; name: string; url: string; size: number; type: string; created_at: string }) => {
    if (mediaPickerTarget === 'cover') {
      // Set cover image
      form.setValue('coverImage', file.url);
    } else {
      // Insert into content at cursor position
      const markdownImage = `![${file.name}](${file.url})`;
      const currentContent = content;
      const newContent = currentContent + '\n\n' + markdownImage;
      setContent(newContent);
      form.setValue('content', newContent);
    }
    setShowMediaPicker(false);
  };

  const handleOpenMediaPicker = (target: 'cover' | 'content') => {
    setMediaPickerTarget(target);
    setShowMediaPicker(true);
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    
    try {
      // Generate defaults for empty fields
      const title = data.title || "Untitled Draft";
      const slug = data.slug || `draft-${Date.now()}`;
      
      // Prepare post data for API - always save as draft
      const postData = {
        title: title,
        slug: slug,
        excerpt: data.excerpt || null,
        content: data.content || null,
        featured_image_url: data.coverImage || null,
        category_id: data.category || null,
        author_id: data.author || defaultAuthorId,
        status: 'draft', // Always save as draft from editor
        featured: !!data.featured,
        meta_title: title,
        meta_description: data.excerpt || null,
      };
      
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }
      
      // Show success message
      toast({
        title: "Success",
        description: postId ? "Draft updated successfully!" : "Draft saved successfully!",
      });
      
      // Redirect to posts list
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {postId ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-muted-foreground">
                {postId ? "Update your blog post" : "Write a new blog post with MDX support"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/posts")}
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {postId ? 'Update Draft' : 'Save Draft'}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">Post Details</TabsTrigger>
              <TabsTrigger value="content">Content Editor</TabsTrigger>
              <TabsTrigger value="preview">Full Preview</TabsTrigger>
            </TabsList>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter post title" 
                          {...field} 
                          onChange={handleTitleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="post-url-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of the post (appears in post lists and SEO)" 
                        className="h-24 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCategories ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm">Loading categories...</span>
                            </div>
                          ) : categories.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No categories available. Create some categories first.
                            </div>
                          ) : (
                            categories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: category.color }}
                                  />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingAuthors ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-sm">Loading authors...</span>
                            </div>
                          ) : authors.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No authors available. Add authors in Settings.
                            </div>
                          ) : (
                            authors.map((author) => (
                              <SelectItem 
                                key={author.id} 
                                value={author.id}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                                    {author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium">{author.name}</div>
                                    {author.is_default && (
                                      <div className="text-xs text-muted-foreground">Default</div>
                                    )}
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tag1, tag2, tag3 (comma separated)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Post</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="space-y-1">
                          <div className="font-medium">Show on Home as Featured</div>
                          <p className="text-sm text-muted-foreground">Toggle to include this post in the Featured Articles section on the homepage.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-5 w-5"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenMediaPicker('cover')}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {field.value && (
                          <div className="relative h-32">
                            <NextImage
                              src={field.value as string}
                              alt="Cover preview"
                              fill
                              sizes="100vw"
                              className="object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => form.setValue('coverImage', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Content Editor Tab */}
            <TabsContent value="content" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Content Editor</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenMediaPicker('content')}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Insert Image
                  </Button>
                </div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div data-color-mode="light" className="min-h-[700px]">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || "")}
                      preview="live"
                      height={700}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      textareaProps={{
                        placeholder: "# Start writing your post here...\n\nYou can use **Markdown** and _MDX_ syntax.\n\n## Features\n- Live preview\n- Syntax highlighting\n- Image support\n- Tables\n- Code blocks",
                      }}
                      onPaste={async (event) => {
                        const clipboardEvent = event as unknown as ClipboardEvent;
                        const result = await handleImagePaste(clipboardEvent.clipboardData);
                        if (result) {
                          const textarea = event.target as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const after = text.substring(end);
                          const imageMarkdown = `![Image](${result})`;
                          setContent(before + imageMarkdown + after);
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                </CardContent>
                </Card>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Full Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <Card className="min-h-[600px]">
                <CardContent className="p-6 md:p-12">
                  <article className="mx-auto max-w-4xl">
                    {form.watch("coverImage") && (
                      <div className="relative mb-8 -mx-6 md:-mx-12 -mt-6 md:-mt-12 h-64 md:h-96">
                        <NextImage 
                          src={form.watch("coverImage") as string} 
                          alt={form.watch("title") || 'Cover image'}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4 mb-8">
                      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        {form.watch("title") || "Untitled Post"}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {categories.find(c => c.id === form.watch("category"))?.name || "Uncategorized"}
                        </span>
                        {form.watch("tags") && (
                          <div className="flex flex-wrap gap-2">
                            {form.watch("tags")?.split(',').map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {form.watch("excerpt") && (
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/20 pl-4 italic">
                          {form.watch("excerpt")}
                        </p>
                      )}
                    </div>
                    
                    <div 
                      data-color-mode="light"
                      className="prose prose-lg md:prose-xl dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-h1:text-3xl md:prose-h1:text-4xl
                        prose-h2:text-2xl md:prose-h2:text-3xl
                        prose-h3:text-xl md:prose-h3:text-2xl
                        prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
                        prose-li:text-base md:prose-li:text-lg
                        prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:italic
                        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal
                        prose-pre:bg-muted prose-pre:border prose-pre:border-border
                        prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto
                        prose-strong:font-bold prose-strong:text-foreground
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    >
                      <MarkdownPreview 
                        source={content || "*No content yet. Start writing in the Content Editor tab.*"}
                        rehypePlugins={[[rehypeSanitize]]}
                      />
                    </div>
                  </article>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
      
      {/* Media Picker Modal */}
      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onSelect={handleMediaSelect}
        title={mediaPickerTarget === 'cover' ? 'Select Cover Image' : 'Insert Image'}
        description={mediaPickerTarget === 'cover' 
          ? 'Choose an image for your post cover.' 
          : 'Choose an image to insert into your post content.'
        }
      />
    </div>
  );
}
