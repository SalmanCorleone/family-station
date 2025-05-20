import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IMonthSelectorProps {
  activeMonthIndex: number;
  setActiveMonthIndex: (index: number) => void;
}

const MonthSelector = ({ activeMonthIndex, setActiveMonthIndex }: IMonthSelectorProps) => {
  return (
    <div className="flex items-center justify-center mt-4">
      <div className="flex items-center bg-ash/10 gap-4 w-[80vw] xl:w-auto justify-between rounded-lg">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setActiveMonthIndex(activeMonthIndex - 1)}
          aria-label="Previous month"
          className="border-0 shadow"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-[150px] text-center font-medium">
          {activeMonthIndex === 0
            ? 'This month'
            : activeMonthIndex === -1
              ? 'Last month'
              : dayjs().add(activeMonthIndex, 'month').format('MMMM YYYY')}
        </div>

        <Button
          variant="outline"
          size="icon"
          disabled={activeMonthIndex >= 0}
          onClick={() => setActiveMonthIndex(activeMonthIndex + 1)}
          aria-label="Next month"
          className="border-0 shadow"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MonthSelector;
