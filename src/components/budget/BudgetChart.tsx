
import React from "react";
import { Pie } from "recharts";
import { PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface BudgetChartProps {
  data: Array<{
    id: string;
    name: string;
    percentage: number;
    amount: number;
    color: string;
  }>;
}

export function BudgetChart({ data }: BudgetChartProps) {
  // Filter out platforms with 0% allocation
  const chartData = data
    .filter(platform => platform.percentage > 0)
    .map(platform => ({
      name: platform.name,
      value: platform.percentage,
      amount: platform.amount,
      color: platform.color,
    }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p>{`Allocation: ${payload[0].value}%`}</p>
          <p>{`Amount: $${payload[0].payload.amount.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/20">
        <p className="text-muted-foreground text-sm">No budget allocation data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
