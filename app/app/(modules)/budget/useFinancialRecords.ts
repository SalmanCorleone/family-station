import { formatDate } from '@/utils';
import { useProfile } from '@/utils/context/profileContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRecords } from './actions';
import dayjs from 'dayjs';

const useFinancialRecords = () => {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecordType[] | null>();
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeRecord, setActiveRecord] = useState<FinancialRecordType | undefined>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Records' | 'Stats'>('Records');
  const { family, updateFamilySettingsInContext, isLoading } = useProfile();

  const budgetThisMonth = useMemo(() => {
    if (!family) return 0;
    const familySettings = family?.settings as FamilySettingsType;
    const selectedMothKey = dayjs().add(activeMonthIndex, 'month').format('YYYY-MM');
    return familySettings?.budget?.[selectedMothKey] || 0;
  }, [activeMonthIndex, family]);

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

  const { groupedByDate, spendingByCategory, totalSpent } = useMemo(() => {
    if (!financialRecords?.length) return { groupedByDate: null, spendingByCategory: null, totalSpent: 0 };
    const groupedByDate = {} as Record<string, FinancialRecordType[]>;
    const spendingByCategory = {} as Record<string, number>;
    let totalSpent = 0;
    for (const item of financialRecords) {
      /**
       * push to date groups
       */
      const date = formatDate(item.created_at);
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
      /**
       * Push to category groups
       */
      const category = item.category;
      if (!category) continue;
      spendingByCategory[category] = (spendingByCategory[category] || 0) + (item?.amount || 0);
      /**
       * Get Total spent
       */
      totalSpent += item?.amount || 0;
    }
    return { groupedByDate, spendingByCategory, totalSpent };
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
    totalSpent,
    budgetThisMonth,
    updateFamilySettingsInContext,
    isLoading,
  };
};

export default useFinancialRecords;
