"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

interface TickingCounterProps {
    value: number;
    direction?: "up" | "down";
    className?: string;
    suffix?: string;
}

export function TickingCounter({
    value,
    direction = "up",
    className = "",
    suffix = "",
}: TickingCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const spring = useSpring(0, {
        mass: 1,
        stiffness: 100,
        damping: 30,
    });

    const display = useTransform(spring, (current) => {
        return Math.round(current).toLocaleString();
    });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [value, isInView, spring]);

    return (
        <span className={className}>
            <motion.span ref={ref}>{display}</motion.span>
            {suffix}
        </span>
    );
}
