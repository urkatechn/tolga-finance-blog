import { TrendingUp, BookOpen, Users } from "lucide-react";

interface BlogHeaderProps {
  totalPosts: number;
  totalCategories: number;
}

export default function BlogHeader({ totalPosts, totalCategories }: BlogHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="block text-gray-900 dark:text-white">
              Finance
            </span>
            <span className="block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background-clip:text]">
              Knowledge Hub
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover expert insights, practical strategies, and actionable advice to master your financial journey
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{totalPosts}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Articles</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{totalCategories}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Categories</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">Weekly</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
