"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 85,
  },
  {
    name: "Feb",
    total: 88,
  },
  {
    name: "Mar",
    total: 92,
  },
  {
    name: "Apr",
    total: 90,
  },
  {
    name: "May",
    total: 95,
  },
  {
    name: "Jun",
    total: 94,
  },
  {
    name: "Jul",
    total: 91,
  },
  {
    name: "Aug",
    total: 96,
  },
  {
    name: "Sep",
    total: 93,
  },
  {
    name: "Oct",
    total: 97,
  },
  {
    name: "Nov",
    total: 98,
  },
  {
    name: "Dec",
    total: 95,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
