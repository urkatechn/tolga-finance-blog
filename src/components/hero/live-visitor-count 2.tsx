"use client";

import { useEffect, useState } from "react";
import { TickingCounter } from "@/components/ui/ticking-counter";

export function LiveVisitorCount({ className = "" }: { className?: string }) {
    // We'll use a realistic base number and simulate live fluctuations
    // Since we don't have a real-time web socket for visitors yet.
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Initial "seed" count
        const baseCount = 1420;
        const randomInitial = Math.floor(Math.random() * 50);
        setCount(baseCount + randomInitial);

        // Simulate live traffic fluctuations
        const interval = setInterval(() => {
            setCount(prev => {
                const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(1400, prev + fluctuation);
            });
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    if (count === 0) return null;

    return (
        <TickingCounter
            value={count}
            className={className}
        />
    );
}
