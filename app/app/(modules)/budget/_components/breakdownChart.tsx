'use client';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { colors } from '@/utils/const';
import dayjs from 'dayjs';
import { ChartPie } from 'lucide-react';
import { useMemo } from 'react';

interface IBreakdownChartProps {
  spendingByCategory: Record<string, number>;
  activeMonthIndex: number;
}

const BreakdownChart = ({ spendingByCategory, activeMonthIndex }: IBreakdownChartProps) => {
  const totalAmount = useMemo(
    () => Object.values(spendingByCategory).reduce((acc, curr) => acc + curr, 0),
    [spendingByCategory],
  );

  const pieChartData = useMemo(
    () =>
      Object.entries(spendingByCategory).map(([category, amount], index) => ({
        category,
        amount,
        fill: colors[index % colors.length],
      })),
    [spendingByCategory],
  );

  const chartConfig = {} satisfies ChartConfig;

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <ChartPie className="h-8 w-8" stroke="var(--color-green)" />
          <div>
            <CardTitle>Spending by category</CardTitle>
            <CardDescription>{dayjs().add(activeMonthIndex, 'month').format('MMMM YYYY')}</CardDescription>
          </div>
        </div>
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
            {/* Todo: make custom legend */}
            {/* <Legend content={<CustomLegend />} /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BreakdownChart;
