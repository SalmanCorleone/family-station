'use client';

import AddRecordSection from './_components/addRecordSection';
import BreakdownChart from './_components/breakdownChart';
import Record from './_components/record';
import useFinancialRecords from './useFinancialRecords';
import MonthSelector from './_components/monthSelector';
import { useRef } from 'react';
import EditRecordDialog from './_components/editRecordDialog';
import Empty from '@/components/empty';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import PageHeader from '@/components/pageHeader';
import TabSelector from './_components/tabSelector';
import { cn } from '@/utils/clsx';
import TimelineChart from './_components/timelineChart';
import { motion } from 'framer-motion';
import BudgetProgress from './_components/budgetProgress';

const Budget = () => {
  const {
    loading,
    activeMonthIndex,
    setActiveMonthIndex,
    groupedByDate,
    spendingByCategory,
    refetchRecords,
    activeRecord,
    setActiveRecord,
    activeTab,
    setActiveTab,
    totalSpent,
    budgetThisMonth,
    updateFamilySettingsInContext,
    isLoading,
  } = useFinancialRecords();
  const editRecordDialogRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="">
      <PageHeader title="Budget" />
      <div className="flex flex-col gap-4">
        <MonthSelector {...{ activeMonthIndex, setActiveMonthIndex }} />
        <TabSelector {...{ activeTab, setActiveTab }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
        <div className={cn('flex flex-col gap-4 col-span-1', { 'hidden xl:block': activeTab === 'Stats' })}>
          <AddRecordSection {...{ refetchRecords }} />

          <div className="flex flex-col gap-4">
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ height: '0%' }}
              animate={{ height: loading ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Loader className="animate-spin" />
            </motion.div>
            {!!groupedByDate &&
              Object.keys(groupedByDate).map((dateString) => (
                <div key={dateString}>
                  <p className="text-muted-foreground pb-1 text-sm">{dateString}</p>
                  <div className="flex flex-col gap-3">
                    {groupedByDate[dateString].map((record) => (
                      <Record
                        key={record.id}
                        record={record}
                        onRecordClick={() => {
                          setActiveRecord(record);
                          editRecordDialogRef.current?.click();
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {Object.values(spendingByCategory || {})?.length ? (
          <div className={cn('col-span-1 flex flex-col gap-4', { 'hidden xl:flex': activeTab === 'Records' })}>
            <BudgetProgress
              {...{ activeMonthIndex, totalSpent, budget: budgetThisMonth, updateFamilySettingsInContext, isLoading }}
            />
            {!!spendingByCategory && (
              <BreakdownChart spendingByCategory={spendingByCategory} {...{ activeMonthIndex }} />
            )}
            {!!groupedByDate && <TimelineChart {...{ groupedByDate, activeMonthIndex }} />}
          </div>
        ) : (
          <Card className="col-span-1">
            <Empty text="No records yet. Add some!" />
          </Card>
        )}
      </div>

      <EditRecordDialog
        ref={editRecordDialogRef}
        record={activeRecord}
        setRecord={setActiveRecord}
        onSubmit={refetchRecords}
      />
    </div>
  );
};

export default Budget;
