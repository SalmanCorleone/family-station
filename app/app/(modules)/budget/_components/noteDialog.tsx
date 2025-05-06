import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';

interface INoteDialog {
  note: string;
  setNote: (note: string) => void;
}

const NoteDialog = ({ note, setNote }: INoteDialog) => {
  const [open, setOpen] = useState(false);

  const onkeydown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === 'NumpadEnter') {
        e.preventDefault();
        setOpen(false);
      }
    },
    [setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <Pencil size={16} fill="var(--color-orange)" />
          {!!note ? <p>{note}</p> : <p className="text-gray-600">(Note)</p>}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-light w-auto">
        <DialogHeader>
          <DialogTitle>Add a note</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 py-4 items-center">
          <input
            type="text"
            defaultValue={note}
            className="w-[80vw] xl:w-lg"
            placeholder="Ex: Groceries from HelloFresh"
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={onkeydown}
          />
        </div>
        <Button variant={'default'} onClick={() => setOpen(false)}>
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
