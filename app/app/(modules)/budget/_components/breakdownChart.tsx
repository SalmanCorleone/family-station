'use client';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { colors } from '@/utils/const';
import { useMemo } from 'react';

interface IBreakdownChartProps {
  spendingPerCategory: Record<string, number>;
}

const BreakdownChart = ({ spendingPerCategory }: IBreakdownChartProps) => {
  const totalAmount = useMemo(
    () => Object.values(spendingPerCategory).reduce((acc, curr) => acc + curr, 0),
    [spendingPerCategory],
  );

  const pieChartData = useMemo(
    () =>
      Object.entries(spendingPerCategory).map(([category, amount], index) => ({
        category,
        amount,
        fill: colors[index % colors.length],
      })),
    [spendingPerCategory],
  );

  const chartConfig = {} satisfies ChartConfig;

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>This month</CardTitle>
        <CardDescription>Spending by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={pieChartData} dataKey="amount" nameKey="category" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          ${totalAmount.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BreakdownChart;
