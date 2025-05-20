'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ITabSelectorProps {
  activeTab: 'Records' | 'Stats';
  setActiveTab: (tab: 'Records' | 'Stats') => void;
}

const TabSelector = ({ activeTab, setActiveTab }: ITabSelectorProps) => {
  return (
    <div className="flex justify-center xl:hidden">
      <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'Records' | 'Stats')}>
        <TabsList className="w-[80vw]">
          <TabsTrigger value="Records">Records</TabsTrigger>
          <TabsTrigger value="Stats">Stats</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabSelector;
