import { formatDate } from '@/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEMO_DATA } from '../demoData';
import dayjs from 'dayjs';

const records = DEMO_DATA.FINANCIAL_RECORDS;

const useFinancialRecords = () => {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecordType[]>(records);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeRecord, setActiveRecord] = useState<FinancialRecordType | undefined>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Records' | 'Stats'>('Records');

  const refetchRecords = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setFinancialRecords(activeMonthIndex === 0 ? records : []);
  }, [activeMonthIndex]);

  const { groupedByDate, spendingByCategory } = useMemo(() => {
    if (!financialRecords?.length) return { groupedByDate: null, spendingByCategory: null };
    const groupedByDate = {} as Record<string, FinancialRecordType[]>;
    const spendingByCategory = {} as Record<string, number>;

    for (const item of financialRecords) {
      const date = formatDate(item.created_at);
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
      const category = item.category;
      if (!category) continue;
      spendingByCategory[category] = (spendingByCategory[category] || 0) + (item?.amount || 0);
    }

    return { groupedByDate, spendingByCategory };
  }, [financialRecords]);

  const addRecord = useCallback((payload: AddFinancialRecordPayloadType) => {
    setFinancialRecords((financialRecords) => {
      const newRecord: FinancialRecordType = {
        ...payload,
        id: financialRecords.length + 1,
        created_at: dayjs().toISOString(),
        profiles: DEMO_DATA.PROFILE,
      };
      return [...financialRecords, newRecord];
    });
  }, []);

  const updateRecord = useCallback((id: FinancialRecordType['id'], payload: AddFinancialRecordPayloadType) => {
    setFinancialRecords((financialRecords) => {
      const index = financialRecords.findIndex((record) => record.id === id);
      if (index === -1) return financialRecords;
      const updatedRecord = { ...financialRecords[index], ...payload };
      return [...financialRecords.slice(0, index), updatedRecord, ...financialRecords.slice(index + 1)];
    });
  }, []);

  return {
    financialRecords,
    setFinancialRecords,
    groupedByDate,
    spendingByCategory,
    activeMonthIndex,
    setActiveMonthIndex,
    loading,
    refetchRecords,
    activeRecord,
    setActiveRecord,
    activeTab,
    setActiveTab,
    addRecord,
    updateRecord,
  };
};

export default useFinancialRecords;
