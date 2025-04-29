import {
  Banknote,
  Blend,
  Car,
  Gift,
  HeartPulse,
  HousePlug,
  Landmark,
  Leaf,
  List,
  MessageSquareMore,
  PartyPopper,
  ShieldAlert,
  ShoppingBag,
  Soup,
  TreePalm,
  TvMinimalPlay,
} from 'lucide-react';

const borderColor = 'var(--color-gray-700)';

export enum CATEGORY_TYPE {
  ESSENTIAL = 'Essential',
  OCCASIONAL = 'Occasional',
}

export const categoryList: CategoryType[] = [
  // Essentials
  {
    title: 'Food',
    color: 'var(--color-lime)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <Soup fill={'var(--color-lime)'} color={borderColor} {...props} />,
  },
  {
    title: 'Shopping',
    color: 'var(--color-pink)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <ShoppingBag fill={'var(--color-pink)'} color={borderColor} {...props} />,
  },
  {
    title: 'Home',
    color: 'var(--color-lightPurple)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <HousePlug fill={'var(--color-lightPurple)'} color={borderColor} {...props} />,
  },
  {
    title: 'Personal',
    color: 'var(--color-light)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <Leaf fill={'var(--color-light)'} color={borderColor} {...props} />,
  },
  {
    title: 'Transport',
    color: 'var(--color-ash)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <Car fill={'var(--color-ash)'} color={borderColor} {...props} />,
  },
  {
    title: 'Medical',
    color: 'var(--color-orange)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <HeartPulse fill={'var(--color-orange)'} color={borderColor} {...props} />,
  },
  {
    title: 'Subscription',
    color: 'var(--color-lightBlue)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <TvMinimalPlay fill={'var(--color-lightBlue)'} color={borderColor} {...props} />,
  },
  {
    title: 'Fees',
    color: 'var(--color-green)',
    type: CATEGORY_TYPE.ESSENTIAL,
    icon: (props) => <Landmark fill={'var(--color-green)'} color={borderColor} {...props} />,
  },

  // Occasional
  {
    title: 'Entertainment',
    color: 'var(--color-blue)',
    type: CATEGORY_TYPE.OCCASIONAL,
    icon: (props) => <PartyPopper fill={'var(--color-blue)'} color={borderColor} {...props} />,
  },
  {
    title: 'Emergency',
    color: 'var(--color-orange)',
    type: CATEGORY_TYPE.OCCASIONAL,
    icon: (props) => <ShieldAlert fill={'var(--color-orange)'} color={borderColor} {...props} />,
  },
  {
    title: 'Gift',
    color: 'var(--color-pale)',
    type: CATEGORY_TYPE.OCCASIONAL,
    icon: (props) => <Gift fill={'var(--color-pale)'} color={borderColor} {...props} />,
  },
  {
    title: 'Vacation',
    color: 'var(--color-lightGreen)',
    type: CATEGORY_TYPE.OCCASIONAL,
    icon: (props) => <TreePalm fill={'var(--color-lightGreen)'} color={borderColor} {...props} />,
  },
  {
    title: 'Others',
    color: 'var(--color-gray-200)',
    type: CATEGORY_TYPE.OCCASIONAL,
    icon: (props) => <Blend fill={'var(--color-gray-200)'} color={borderColor} {...props} />,
  },
];

export const navItemList: NavItemType[] = [
  { name: 'Budget', href: '/app/budget', icon: (props) => <Banknote fill="var(--color-lightGreen)" {...props} /> },
  { name: 'Chat', href: '/app/chat', icon: (props) => <MessageSquareMore fill="var(--color-pink)" {...props} /> },
  { name: 'To-do', href: '/app/to-do', icon: (props) => <List fill="var(--color-blue)" {...props} /> },
];
