"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { Category } from "@/lib/database/setup";

interface SearchFiltersProps {
  categories: Category[];
}

export default function SearchFilters({ categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  const updateFilters = (newSearch?: string, newCategory?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSearch !== undefined) {
      if (newSearch) {
        params.set('search', newSearch);
      } else {
        params.delete('search');
      }
    }
    
    if (newCategory !== undefined) {
      if (newCategory && newCategory !== 'all') {
        params.set('category', newCategory);
      } else {
        params.delete('category');
      }
    }

    router.push(`/blog?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, category);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    updateFilters(search, newCategory);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    router.push('/blog');
  };

  const hasActiveFilters = search || (category && category !== 'all');

  return (
    <div className="bg-white dark:bg-gray-900 border-b sticky top-16 z-40 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3 items-center flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-10"
                />
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      updateFilters('', category);
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>

            {/* Category Filter and Clear */}
            <div className="flex gap-3 items-center">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
