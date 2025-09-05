import { firestore, storage } from './firebase';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  author: string;
  publishedAt?: string;
  updatedAt: string;
  readTime: number;
  featured: boolean;
  coverImage?: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  featured: boolean;
  coverImage?: string | File;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const snapshot = await firestore.collection('posts').where('status', '!=', 'deleted').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const doc = await firestore.collection('posts').doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    } as Post;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const snapshot = await firestore.collection('posts').where('slug', '==', slug).get();
    if (snapshot.docs.length === 0) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Post;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

export async function createPost(data: PostFormData): Promise<{ id: string } | null> {
  try {
    // Handle cover image upload if it's a File
    let coverImageUrl = data.coverImage as string | undefined;
    
    if (data.coverImage instanceof File) {
      const file = data.coverImage;
      const storageRef = storage.ref(`posts/covers/${Date.now()}-${file.name}`);
      const uploadTask = await storageRef.put();
      coverImageUrl = await uploadTask.ref.getDownloadURL();
    }
    
    const now = new Date().toISOString();
    const postData = {
      ...data,
      coverImage: coverImageUrl,
      author: 'admin-user-123', // In a real app, this would be the current user's ID
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : null,
      readTime: estimateReadTime(data.content),
    };
    
    const docRef = await firestore.collection('posts').add(postData);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export async function updatePost(id: string, data: PostFormData): Promise<boolean> {
  try {
    // Handle cover image upload if it's a File
    let coverImageUrl = data.coverImage as string | undefined;
    
    if (data.coverImage instanceof File) {
      const file = data.coverImage;
      const storageRef = storage.ref(`posts/covers/${Date.now()}-${file.name}`);
      const uploadTask = await storageRef.put();
      coverImageUrl = await uploadTask.ref.getDownloadURL();
    }
    
    const now = new Date().toISOString();
    const postData = {
      ...data,
      coverImage: coverImageUrl,
      updatedAt: now,
      // If status changed to published and wasn't published before, set publishedAt
      publishedAt: data.status === 'published' ? 
        (await getPostById(id))?.publishedAt || now : 
        null,
      readTime: estimateReadTime(data.content),
    };
    
    await firestore.collection('posts').doc(id).update(postData);
    return true;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    return false;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    // Soft delete by updating status
    await firestore.collection('posts').doc(id).update({
      status: 'deleted',
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return false;
  }
}

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  try {
    const snapshot = await firestore
      .collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishedAt')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const snapshot = await firestore
      .collection('posts')
      .where('status', '==', 'published')
      .where('featured', '==', true)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const snapshot = await firestore
      .collection('posts')
      .where('status', '==', 'published')
      .where('category', '==', category)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error(`Error fetching posts in category ${category}:`, error);
    return [];
  }
}

// Helper function to estimate read time based on content length
function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}
