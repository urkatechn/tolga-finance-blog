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
import { Loader2, Save, X } from "lucide-react";

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

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  slug: z.string().min(5, {
    message: "Slug must be at least 5 characters.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  category: z.string().min(1, { message: "Please select a category." }),
  status: z.enum(["draft", "published", "archived"]),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample categories
const categories = [
  { value: "investing", label: "Investing" },
  { value: "saving", label: "Saving" },
  { value: "retirement", label: "Retirement" },
  { value: "crypto", label: "Crypto" },
  { value: "taxes", label: "Taxes" },
  { value: "personal-finance", label: "Personal Finance" },
  { value: "economy", label: "Economy" },
  { value: "education", label: "Education" },
];

interface PostEditorV2Props {
  postId?: string;
  initialData?: Partial<FormValues>;
}

export function PostEditorV2({ postId, initialData }: PostEditorV2Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(initialData?.content || "");
  const [activeTab, setActiveTab] = useState("metadata");

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      status: initialData?.status || "draft",
      coverImage: initialData?.coverImage || "",
      tags: initialData?.tags || "",
    },
  });

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
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("title"))) {
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

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    
    try {
      // In a real app, save to your backend
      console.log("Saving post:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      if (postId) {
        alert("Post updated successfully!");
      } else {
        alert("Post created successfully!");
      }
      
      // Redirect to posts list
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    form.setValue("status", "draft");
    await form.handleSubmit(onSubmit)();
  };

  // Handle publish
  const handlePublish = async () => {
    form.setValue("status", "published");
    await form.handleSubmit(onSubmit)();
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
                type="button"
                variant="secondary"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Draft
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Publish
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
                          {categories.map((category) => (
                            <SelectItem 
                              key={category.value} 
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </div>

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            {/* Content Editor Tab */}
            <TabsContent value="content" className="mt-6">
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
                        const clipboardEvent = event as ClipboardEvent;
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
            </TabsContent>

            {/* Full Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <Card className="min-h-[600px]">
                <CardContent className="p-6 md:p-12">
                  <article className="mx-auto max-w-4xl">
                    {form.watch("coverImage") && (
                      <div className="mb-8 -mx-6 md:-mx-12 -mt-6 md:-mt-12">
                        <img 
                          src={form.watch("coverImage")} 
                          alt={form.watch("title")}
                          className="w-full h-64 md:h-96 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-4 mb-8">
                      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        {form.watch("title") || "Untitled Post"}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {categories.find(c => c.value === form.watch("category"))?.label || "Uncategorized"}
                        </span>
                        {form.watch("tags") && (
                          <div className="flex flex-wrap gap-2">
                            {form.watch("tags").split(',').map((tag, index) => (
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
    </div>
  );
}
