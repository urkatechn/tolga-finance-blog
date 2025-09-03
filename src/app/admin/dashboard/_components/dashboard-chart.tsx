"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { PostViewsData } from "@/lib/api/dashboard";

interface DashboardChartProps {
  data: PostViewsData[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  // Format dates to be more readable
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          stroke={isDark ? "#64748b" : "#94a3b8"}
          tickFormatter={(value) => value.split(" ")[1]}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={8}
          stroke={isDark ? "#64748b" : "#94a3b8"}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" }}
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: "6px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          labelStyle={{
            color: isDark ? "#e2e8f0" : "#334155",
            fontWeight: 600,
            marginBottom: "4px",
          }}
          itemStyle={{
            color: isDark ? "#94a3b8" : "#64748b",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value.toLocaleString(), "Views"]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar 
          dataKey="views" 
          fill={isDark ? "#3b82f6" : "#2563eb"} 
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
