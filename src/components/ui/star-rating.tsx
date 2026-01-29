"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    rank: number;
    className?: string;
    size?: number;
}

export function StarRating({ rank, className = "", size = 14 }: StarRatingProps) {
    // Ensure rank is between 1 and 5
    const normalizedRank = Math.max(1, Math.min(5, rank));

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={`${i < normalizedRank
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-200 dark:text-slate-800"
                        } transition-colors`}
                />
            ))}
        </div>
    );
}
