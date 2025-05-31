import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import dayjs from 'dayjs';

interface IBudgetDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  newBudgetAmount?: number;
  setNewBudgetAmount: (newBudgetAmount: number) => void;
  onBudgetSubmit: () => void;
  isLoading: boolean;
  activeMonthIndex: number;
}

const BudgetDialog = ({
  open,
  setOpen,
  newBudgetAmount,
  setNewBudgetAmount,
  onBudgetSubmit,
  isLoading,
  activeMonthIndex,
}: IBudgetDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>
          <div className="text-lg font-semibold">
            Our budget for {dayjs().add(activeMonthIndex, 'month').format('MMMM YYYY')}
          </div>
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            className="text-3xl xl:text-3xl h-min"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(+e.currentTarget.value)}
          />
          <Button loading={isLoading} onClick={onBudgetSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
