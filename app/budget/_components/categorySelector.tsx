import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CATEGORY_TYPE, categoryList } from '@/utils/const';

interface ICategorySelector {
  activeCategory: CategoryType;
  setCategory: (category: CategoryType) => void;
}

const categoriesGroupedByType = categoryList.reduce((acc, curr) => {
  const { type } = curr;
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(curr);
  return acc;
}, {} as { [key in CATEGORY_TYPE]: CategoryType[] });

const CategorySelector = ({ activeCategory, setCategory }: ICategorySelector) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <div>{activeCategory.icon({ size: 16 })}</div>
          <div>{activeCategory.title}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-light max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pick a category</DialogTitle>
        </DialogHeader>
        <div className="">
          {Object.keys(categoriesGroupedByType).map((type) => (
            <div key={type} className="flex flex-col gap-2 mb-4">
              <p className="text-sm text-gray-400">{type}</p>
              <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
                {categoriesGroupedByType[type as CATEGORY_TYPE].map((category) => (
                  <DialogClose key={category.title}>
                    <div
                      className={cn(
                        'flex gap-2 p-4 rounded-xl shadow-xs bg-white border border-light hover:border-lightGreen cursor-pointer',
                        { 'border-lightGreen': activeCategory.title === category.title },
                      )}
                      onClick={() => setCategory(category)}
                    >
                      <p>{category.icon()}</p>
                      <p>{category.title}</p>
                    </div>
                  </DialogClose>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySelector;
