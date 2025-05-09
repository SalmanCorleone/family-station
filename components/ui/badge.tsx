import { cn } from '@/utils/clsx';

const Badge = ({ className, children, ...rest }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex h-min items-center px-2 py-0.5 rounded-lg bg-green-100 text-xs font-medium text-green hover:bg-green-50',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Badge;
