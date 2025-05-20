import { Loader } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/utils/clsx';

interface ISimpleLoaderProps {
  loaderClassName?: React.HTMLAttributes<HTMLDivElement>;
}

const SimpleLoader = ({ loaderClassName }: ISimpleLoaderProps) => {
  return (
    <Card className="bg-light shadow-none">
      <CardContent>
        <div className={cn('flex justify-center items-center h-20')}>
          <Loader className={cn('animate-spin h-5 w-5', loaderClassName)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleLoader;
