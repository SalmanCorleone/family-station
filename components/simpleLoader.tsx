import { Loader } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/utils/clsx';

interface ISimpleLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  loaderClassName?: React.HTMLAttributes<HTMLDivElement>;
}

const SimpleLoader = ({ loaderClassName, ...containerClassName }: ISimpleLoaderProps) => {
  return (
    <Card>
      <CardContent>
        <div className={cn('flex justify-center items-center h-20', containerClassName)}>
          <Loader className={cn('animate-spin h-5 w-5', loaderClassName)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleLoader;
