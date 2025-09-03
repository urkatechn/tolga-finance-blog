"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

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
import { MDXEditorToolbar } from "./mdx-editor-toolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

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

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [, setActiveTab] = useState("edit");
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(!!postId);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the form with synchronous default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      status: "draft",
    },
  });

  // Load existing post data if editing
  useEffect(() => {
    if (postId) {
      const loadPostData = async () => {
        setIsLoading(true);
        try {
          // In a real app, fetch the post data from your API/database
          // For now, we'll use mock data based on the ID
          console.log(`Fetching post data for ID: ${postId}`);
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock data for editing - in a real app, this would come from your API
          const postData = {
            title: `Sample Post ${postId}`,
            slug: `sample-post-${postId}`,
            excerpt: `This is a sample excerpt for post ${postId}.`,
            content: `# Sample Post ${postId}\n\nThis is a sample content for post ${postId}.\n\n## Section 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n## Section 2\n\n- Item 1\n- Item 2\n- Item 3`,
            category: "investing",
            status: "draft" as const,
          };
          
          // Reset form with loaded data
          form.reset(postData);
        } catch (error) {
          console.error('Error loading post data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadPostData();
    }
  }, [postId, form]);

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

  // Handle preview tab click
  const handlePreviewClick = async () => {
    const content = form.getValues("content");
    
    if (content) {
      setIsPreviewLoading(true);
      try {
        const mdxSource = await serialize(content, {
          mdxOptions: {
            development: process.env.NODE_ENV === "development",
          },
        });
        setMdxSource(mdxSource);
      } catch (error) {
        console.error("Error serializing MDX:", error);
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically save the post to your database
    // For now, we'll just log it to the console
    
    if (postId) {
      console.log(`Updating post ${postId} with data:`, data);
      alert(`Post ${postId} updated successfully!`);
    } else {
      console.log("Creating new post with data:", data);
      alert("New post created successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="edit" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger 
            value="preview" 
            onClick={handlePreviewClick}
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading post data...</p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <Input placeholder="enter-post-slug" {...field} />
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
                        placeholder="Brief summary of the post" 
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (MDX)</FormLabel>
                    <div className="space-y-2">
                      <MDXEditorToolbar textareaRef={contentTextareaRef} />
                      <FormControl>
                        <Textarea 
                          placeholder="# Your MDX content here..." 
                          className="min-h-[400px] font-mono"
                          {...field} 
                          ref={(e) => {
                            field.ref(e);
                            contentTextareaRef.current = e;
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => router.push('/admin/posts')}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Post</Button>
              </div>
            </form>
          </Form>
          )}
        </TabsContent>
        <TabsContent value="preview" className="space-y-4">
          <div className="rounded-md border p-6">
            {isPreviewLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : mdxSource ? (
              <div className="prose dark:prose-invert max-w-none">
                <h1>{form.getValues("title")}</h1>
                <MDXRemote {...mdxSource} />
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                No content to preview
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
