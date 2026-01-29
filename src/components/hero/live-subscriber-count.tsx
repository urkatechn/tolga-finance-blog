"use client";

import { useEffect, useState } from "react";
import { TickingCounter } from "@/components/ui/ticking-counter";

interface LiveSubscriberCountProps {
    initialCount?: string;
    className?: string;
}

export function LiveSubscriberCount({ initialCount = "10000", className = "" }: LiveSubscriberCountProps) {
    // Extract number from string like "25K+" or "10k"
    const parseInitialCount = (count: string) => {
        const numericPart = count.replace(/[^0-9]/g, "");
        const base = parseInt(numericPart, 10);
        if (isNaN(base)) return 10000;
        if (count.toLowerCase().includes("k")) return base * 1000;
        return base;
    };

    const [count, setCount] = useState<number>(parseInitialCount(initialCount));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch("/api/subscribers/count");
                if (response.ok) {
                    const data = await response.json();
                    // To make it look "more realistic" and "busy" as requested, 
                    // we could add a base number if the actual DB count is 0 or very low,
                    // but I'll stick to the actual count + a small "seed" if it's a new site.
                    // The user asked for "actual count" (güncelde takipe alan kişi sayısı).
                    setCount(data.count);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error("Failed to fetch subscriber count:", error);
            }
        };

        fetchCount();

        // Poll every 30 seconds for updates
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TickingCounter
            value={count}
            className={className}
            suffix={count >= 10000 ? "+" : ""}
        />
    );
}
