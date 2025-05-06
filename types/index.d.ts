type CategoryType = {
  title: string;
  color: string;
  type: import('../utils/const').CATEGORY_TYPE;
  icon: (props?: import('lucide-react').LucideProps) => React.ReactElement;
  placeHolderNote?: string;
};

type NavItemType = {
  name: string;
  href: string;
  icon: (props?: import('lucide-react').LucideProps) => React.ReactElement;
};

type OmitId<T> = Omit<T, 'id'>;

type AddFinancialRecordPayloadType = OmitId<Tables<'financial_records'>>;
