import { Suspense } from 'react';
import InputSection from './_components/InputSection';
import { getRecords } from './api';
import RecordItem from './_components/RecordItem';

const Budget = async () => {
  const financialRecords = await getRecords();

  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 budget-screen">
      <h1>Budget</h1>

      <div className="flex flex-col gap-4 mt-8">
        <InputSection />

        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col gap-4">
            {financialRecords?.map((record) => (
              <RecordItem key={record.id} record={record} />
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Budget;
