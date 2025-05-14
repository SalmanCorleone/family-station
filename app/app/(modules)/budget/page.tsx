import { Suspense } from 'react';
import AddRecordSection from './_components/addRecordSection';
import Record from './_components/record';
import { formatDate } from '@/utils';
import { createRecord, FinancialRecord, getRecords } from './actions';
import BreakdownChart from './_components/breakdownChart';
import Empty from '@/components/empty';

const Budget = async () => {
  const financialRecords = await getRecords();
  if (!financialRecords) return <Empty />;

  const financialRecordsGroupedByDate = financialRecords.reduce(
    (acc, record) => {
      const date = formatDate(record.created_at);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    },
    {} as Record<string, FinancialRecord[]>,
  );

  const spendingPerCategory = financialRecords.reduce(
    (acc, record) => {
      const category = record.category;
      if (!category) return acc;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += record.amount || 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="">
      <div className="p-4 border-b border-ash/10">
        <h1 className="text-xl font-semibold">Budget</h1>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 p-4 lg:p-12 gap-4">
        <div className="flex flex-col gap-4 col-span-1">
          <AddRecordSection onSubmit={createRecord} />

          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-col gap-4">
              {!!financialRecordsGroupedByDate &&
                Object.keys(financialRecordsGroupedByDate).map((dateString) => (
                  <div key={dateString}>
                    <p className="text-gray-400 pb-3">{dateString}</p>
                    <div className="flex flex-col gap-4">
                      {financialRecordsGroupedByDate[dateString].map((record) => (
                        <Record key={record.id} record={record} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Suspense>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <BreakdownChart spendingPerCategory={spendingPerCategory} />
          <div className="bg-white p-4 shadow rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
