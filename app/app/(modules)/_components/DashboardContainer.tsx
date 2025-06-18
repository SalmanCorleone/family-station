'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/utils/context/profileContext';
import dayjs from 'dayjs';
import { Zap } from 'lucide-react';
import { use, useMemo } from 'react';

interface IDashboardContainerProps {
  dashboardPromise: Promise<DashboardDataType>;
}

const DashboardContainer = ({ dashboardPromise }: IDashboardContainerProps) => {
  const { members, membersImageMap } = useProfile();
  const { financialRecords, urgentTasks } = use(dashboardPromise);
  const { family } = useProfile();

  console.log({ financialRecords, family, urgentTasks });

  const budgetThisMonth = useMemo(() => {
    if (!family) return 0;
    const familySettings = family?.settings as FamilySettingsType;
    const selectedMonthKey = dayjs().add(0, 'month').format('YYYY-MM');
    return familySettings?.budget?.[selectedMonthKey] || 0;
  }, [family]);

  const totalSpent = useMemo(() => {
    if (!financialRecords) return 0;
    return financialRecords.reduce((acc, record) => acc + (record.amount || 0), 0);
  }, [financialRecords]);

  const remainingBudget = (budgetThisMonth || 0) - totalSpent;

  return (
    <div className="p-4 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-medium mb-3">My Family</h2>

        <div className="flex gap-4">
          {members?.map((member) => (
            <div key={member.id}>
              <Avatar>
                <AvatarImage src={membersImageMap?.[member.profile_id!]} />
                <AvatarFallback className="text-xs">{member.profiles?.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Urgent Tasks</h2>
        <div className="flex flex-col gap-4 w-full xl:w-xs">
          {urgentTasks?.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div>{task.title}</div>
              <div className="flex justify-end flex-1 items-center gap-2">
                {task.assigned_to && (
                  <div>
                    <Avatar style={{ width: 24, height: 24 }}>
                      <AvatarImage src={membersImageMap?.[task.assigned_to]} />
                      <AvatarFallback>{task.profiles?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <Zap className="h-4 w-4" fill="var(--color-orange)" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Budget this month</h2>
        <div>
          <div className="grid grid-cols-3 gap-4 text-center leading-none w-full">
            <div className="col-span-1 bg-white py-4 rounded-2xl">
              <p className="text-2xl font-semibold text-green">${budgetThisMonth}</p>
              <p className="text-xs xl:text-sm text-gray-600">Budget this month</p>
            </div>
            <div className="col-span-1 bg-white py-4 rounded-2xl">
              <p className="text-2xl font-semibold text-green">${totalSpent}</p>
              <p className="text-xs xl:text-sm text-gray-600">Total spent</p>
            </div>
            <div className="col-span-1 bg-white py-4 rounded-2xl">
              <p className="text-2xl font-semibold text-orange">${Math.abs(remainingBudget)}</p>
              <p className="text-xs xl:text-sm text-gray-600">{remainingBudget < 0 ? 'Overspent' : 'Remaining'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
