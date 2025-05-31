import { CircleDollarSign, Pencil, Plus } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import dayjs from 'dayjs';
import { useState } from 'react';
import BudgetDialog from './budgetDialog';

const chartConfig: ChartConfig = {};

interface IBudgetProgressProps {
  activeMonthIndex: number;
  totalSpent: number;
  budget?: number;
  updateFamilySettingsInContext: (settings: FamilySettingsType) => Promise<void>;
  isLoading: boolean;
}

const BudgetProgress = ({
  activeMonthIndex,
  totalSpent,
  budget,
  updateFamilySettingsInContext,
  isLoading,
}: IBudgetProgressProps) => {
  const [newBudgetAmount, setNewBudgetAmount] = useState<number | undefined>(budget);
  const [open, setOpen] = useState(false);
  const spentPercentage = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const remainingBudget = (budget || 0) - totalSpent;
  const selectedMothKey = dayjs().add(activeMonthIndex, 'month').format('YYYY-MM');

  console.log({ spentPercentage, remainingBudget });

  const getStatusColor = () => {
    if (spentPercentage > 90) return 'var(--color-orange)';
    if (spentPercentage > 70) return 'var(--color-pale)';
    return 'var(--color-green)';
  };

  const gaugeData = [
    {
      name: 'Spent',
      value: spentPercentage,
      color: getStatusColor(),
    },
    { name: 'Remaining', value: 100 - spentPercentage, color: 'var(--color-muted)' },
  ];

  const onBudgetSubmit = async () => {
    if (!newBudgetAmount) return;
    const payload: FamilySettingsType = {
      budget: {
        [selectedMothKey]: newBudgetAmount,
      },
    };
    await updateFamilySettingsInContext(payload);
    setOpen(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-8 w-8" stroke="var(--color-orange)" />
          <div>
            <CardTitle>Budget</CardTitle>
            <CardDescription>{dayjs().add(activeMonthIndex, 'month').format('MMMM YYYY')}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button variant={'outline'} onClick={() => setOpen(true)}>
            <Pencil />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {budget ? (
          <div className="relative">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Center text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center pt-4">
                <div className={`text-3xl font-bold`} style={{ color: getStatusColor() }}>
                  {Math.ceil(spentPercentage)}%
                </div>
                <div className="text-sm text-muted-foreground">of budget used</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center border rounded-2xl py-4 border-ash/10">
            <div className="text-muted-foreground text-sm">Track your spending by setting up a budget</div>
            <Button>
              <Plus /> Create budget
            </Button>
          </div>
        )}
      </CardContent>
      {!!budget && (
        <CardFooter className="flex-col gap-2">
          {/* <div className="flex items-center gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div> */}

          <div className="grid grid-cols-3 text-center leading-none w-full">
            <div className="col-span-1 border-r border-ash/10">
              <p className="text-2xl font-semibold text-green">${budget}</p>
              <p className="text-xs xl:text-sm text-gray-600">Total budget</p>
            </div>
            <div className="col-span-1 border-r border-ash/10">
              <p className="text-2xl font-semibold text-orange">${Math.abs(remainingBudget)}</p>
              <p className="text-xs xl:text-sm text-gray-600">{remainingBudget < 0 ? 'Overspent' : 'Remaining'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-2xl font-semibold text-blue">${(totalSpent / +dayjs().get('date')).toFixed(1)}</p>
              <p className="text-xs xl:text-sm text-gray-600">Spent per day</p>
            </div>
          </div>
        </CardFooter>
      )}

      <BudgetDialog
        {...{ open, setOpen, newBudgetAmount, setNewBudgetAmount, onBudgetSubmit, isLoading, activeMonthIndex }}
      />
    </Card>
  );
};

export default BudgetProgress;
