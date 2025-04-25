import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate } from '@/utils';
import { CalendarMinus2 } from 'lucide-react';
import { useState } from 'react';

interface ICategorySelector {
  activeDate: Date;
  setActiveDate: (date?: Date) => void;
}

const DateSelector = ({ activeDate, setActiveDate }: ICategorySelector) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <CalendarMinus2 size={16} fill="var(--color-pale)" />
          <div>{formatDate(activeDate)}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-light w-xs">
        <DialogHeader>
          <DialogTitle>Pick a date</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={activeDate}
          onSelect={(date?: Date) => {
            setActiveDate(date);
            setOpen(false);
          }}
          className="rounded-lg border border-gray-300"
        />
      </DialogContent>
    </Dialog>
  );
};

export default DateSelector;
