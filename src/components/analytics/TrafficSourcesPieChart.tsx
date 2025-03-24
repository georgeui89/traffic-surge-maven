import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { platforms } from '@/utils/mockData';
import { dataColors } from '@/lib/colors';

interface TrafficSourcesPieChartProps {
  title: string;
  description?: string;
  timeRange: string;
  height?: number;
}

export const TrafficSourcesPieChart = ({
  title,
  description,
  timeRange,
  height = 300
}: TrafficSourcesPieChartProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock data
    setTimeout(() => {
      // Use the first 6 platforms from mock data
      const chartData = platforms.slice(0, 6).map((platform, index) => {
        // Generate a random value between 10 and 100
        const value = Math.floor(Math.random() * 90) + 10;
        
        return {
          name: platform.name,
          value,
          color: dataColors[index % dataColors.length]
        };
      });
      
      // Sort by value descending
      chartData.sort((a, b) => b.value - a.value);
      
      setData(chartData);
      setIsLoading(false);
    }, 800);
  }, [timeRange]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            Traffic: {data.value}%
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-col gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <motion.li 
            key={`legend-${index}`}
            className="flex items-center justify-between text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>{entry.value}</span>
            </div>
            <span className="font-medium">{entry.payload.value}%</span>
          </motion.li>
        ))}
      </ul>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      
      <CardContent className="pt-6">
        <div style={{ height: `${height}px` }}>
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-pulse space-y-4 w-full">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-[250px] bg-muted rounded-full w-[250px] mx-auto"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};