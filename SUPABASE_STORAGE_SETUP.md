# Supabase Storage Setup for Blog Images

## 1. Create the Storage Bucket

If you haven't already created the `blog-images` bucket, follow these steps:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Name it `blog-images`
5. Set it as **Private** (we'll manage access via policies)

## 2. Configure Storage Policies

You need to set up RLS policies for the `blog-images` bucket. Go to **Storage > Policies** and create these policies:

### Policy 1: Allow authenticated users to upload files
```sql
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');
```

### Policy 2: Allow authenticated users to view files  
```sql
CREATE POLICY "Authenticated users can view images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'blog-images');
```

### Policy 3: Allow authenticated users to delete files
```sql
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');
```

### Policy 4: Allow public access to view images (for blog readers)
```sql
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'blog-images');
```

## 3. Enable RLS on Storage Objects

Make sure Row Level Security is enabled on the storage.objects table:

```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

## 4. Test the Setup

After setting up these policies, your media management system should work correctly:

- ✅ Upload images via the Media page
- ✅ View uploaded images in the gallery
- ✅ Delete images from the interface
- ✅ Copy image URLs for use in blog posts
- ✅ Public access to images for blog readers

## 5. Usage in Blog Posts

Once images are uploaded, you can:

1. Copy the image URL from the media library
2. Use it in your blog post's cover image field
3. Reference it in your blog post content using Markdown: `![Alt text](image-url)`

## Troubleshooting

If you encounter issues:

1. **403 Forbidden errors**: Check that your RLS policies are set up correctly
2. **Upload failures**: Verify the bucket name is exactly `blog-images`
3. **Images not loading**: Ensure the public access policy is in place
4. **Authentication errors**: Make sure you're logged in to the admin panel

Your media management system is now ready to use! 🎉
