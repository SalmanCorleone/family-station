import { Suspense } from 'react';
import AddRecordSection from './_components/addRecordSection';
import Record from './_components/record';
import { formatDate } from '@/utils';
import { createRecord, FinancialRecord, getRecords } from './actions';

const Budget = async () => {
  const financialRecords = await getRecords();

  const financialRecordsGroupedByDate =
    !!financialRecords &&
    financialRecords.reduce(
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

  return (
    <div className="flex flex-col lg:items-center justify-center p-4 lg:p-12">
      <h1>Budget</h1>

      <div className="flex flex-col gap-4 mt-8">
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
    </div>
  );
};

export default Budget;
