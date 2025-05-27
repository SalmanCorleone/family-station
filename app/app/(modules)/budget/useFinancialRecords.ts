import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRecords } from './actions';
import { formatDate } from '@/utils';
import { useProfile } from '@/utils/context/profileContext';

const useFinancialRecords = () => {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecordType[] | null>();
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeRecord, setActiveRecord] = useState<FinancialRecordType | undefined>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Records' | 'Stats'>('Records');
  const { family } = useProfile();

  const refetchRecords = useCallback(async () => {
    if (!family) return;
    setLoading(true);
    const records = await getRecords(family?.id, activeMonthIndex);
    if (!records) {
      setLoading(false);
      return;
    }
    setLoading(false);
    setFinancialRecords(records);
  }, [family, activeMonthIndex, setFinancialRecords]);

  useEffect(() => {
    refetchRecords();
  }, [refetchRecords]);

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

  return {
    financialRecords,
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
  };
};

export default useFinancialRecords;
