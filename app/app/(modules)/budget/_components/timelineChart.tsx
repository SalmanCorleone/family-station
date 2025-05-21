import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatDate } from '@/utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { FinancialRecord } from '../actions';

const chartConfig = { amount: { label: 'Amount' } } satisfies ChartConfig;

interface ITimelineChartProps {
  groupedByDate: Record<string, FinancialRecord[]>;
  activeMonthIndex: number;
}

const TimelineChart = ({ groupedByDate, activeMonthIndex }: ITimelineChartProps) => {
  const chartData = useMemo(() => {
    // make array of dates in given month
    const firstDayOfGivenMonth = dayjs().add(activeMonthIndex, 'month').startOf('month');
    const dateCount = firstDayOfGivenMonth.daysInMonth();
    const data = [];
    for (let i = 0; i < dateCount; i++) {
      const date = formatDate(firstDayOfGivenMonth.add(i, 'day').toString());
      data.push({ date, amount: groupedByDate?.[date]?.reduce((acc, curr) => acc + (curr?.amount || 0), 0) });
    }
    return data;
  }, [groupedByDate, activeMonthIndex]);

  const mostSpentData = useMemo(() => {
    const max = { date: '', amount: 0 };
    Object.keys(groupedByDate).forEach((date) => {
      const records = groupedByDate[date];
      const totalSpent = records.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
      if (totalSpent > max.amount) {
        max.date = date;
        max.amount = totalSpent;
      }
    });
    return max;
  }, [groupedByDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by day</CardTitle>
        <CardDescription>{dayjs().add(activeMonthIndex, 'month').format('MMMM YYYY')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(-2)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="amount" fill="var(--color-blue)" radius={8}>
              {/* <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} fontWeight={600} /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <TrendingUp size={16} className="fill-orange" strokeWidth={1} />
          Most spent ${mostSpentData.amount} on {mostSpentData.date}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TimelineChart;
