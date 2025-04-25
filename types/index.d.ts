type CategoryType = {
  title: string;
  color: string;
  type: import('../utils/const').CATEGORY_TYPE;
  icon: (props?: import('lucide-react').LucideProps) => React.ReactElement;
};
