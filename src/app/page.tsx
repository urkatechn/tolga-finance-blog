export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Finance Blog</h1>
        <p className="text-lg mb-8">Welcome to our finance blog. Expert insights on personal finance, investing, and market trends.</p>
        <div className="flex gap-4">
          <a 
            href="/blog" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Read Articles
          </a>
          <a 
            href="/admin" 
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
          >
            Admin Panel
          </a>
        </div>
      </main>
    </div>
  );
}
