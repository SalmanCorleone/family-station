import { cn } from '@/utils/clsx';
import { cubicBezier, motion } from 'framer-motion';

const StepProgress = ({ step, totalSteps = 3 }: { step: number; totalSteps: number }) => {
  return (
    <div className="flex items-center gap-8 justify-between relative">
      <div className="absolute top-[50%] left-1 right-1 w-full h-0 border-t-2 border-dashed border-gray-300" />
      <motion.div
        className="absolute top-[50%] left-0 h-1 bg-green"
        animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        transition={{ ease: cubicBezier(0.77, 0, 0.175, 1), duration: 0.3 }}
      />

      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-light border relative flex items-center justify-center gap-4 w-12 h-12 rounded-full transition-[background-color] duration-300',
              {
                'bg-green text-light border-0': step >= index + 1,
              },
            )}
          >
            <h2 className="text-xl font-bold">{index + 1}</h2>
          </div>
        ))}
    </div>
  );
};

export default StepProgress;
