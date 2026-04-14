"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface QueryBarChartProps {
  data: { date: string; count: number }[];
}

export function QueryBarChart({ data }: QueryBarChartProps) {
  return (
    <div className="w-full h-[280px] bg-surface border border-border rounded p-4">
      <h3 className="text-sm font-medium text-muted mb-4 font-[family-name:var(--font-dm-sans)]">
        Queries — Last 30 Days
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={12}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E1E2E"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B6B8A", fontSize: 11 }}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B6B8A", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111118",
              border: "1px solid #1E1E2E",
              borderRadius: "4px",
              color: "#F0F0FF",
              fontSize: "12px",
            }}
            labelFormatter={(val) => new Date(val).toLocaleDateString()}
          />
          <Bar
            dataKey="count"
            fill="#FF2D6B"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
