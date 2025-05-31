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

type FinancialRecordType = NonNullable<
  Awaited<ReturnType<typeof import('../app/app/(modules)/budget/actions').getRecords>>
>[0];
type AddFinancialRecordPayloadType = Omit<OmitId<FinancialRecordType>, 'profiles'>;

type ChatMessageType = NonNullable<
  Awaited<ReturnType<typeof import('../app/app/(modules)/chat/actions').getChatHistory>>
>[0];
type ChatMessagePayloadType = Omit<
  ChatMessageType,
  'profiles' | 'created_at' | 'updated_at' | 'id' | 'status' | 'is_deleted'
>;

type ProfileType = NonNullable<
  Awaited<ReturnType<typeof import('../app/app/(modules)/settings/account/actions').getProfile>>
>;

type FamilyMemberType = NonNullable<
  Awaited<ReturnType<typeof import('../app/app/(modules)/settings/account/actions').getFamilyMembers>>
>[0];

type FamilySettingsType = {
  budget: Record<string, number>;
}

