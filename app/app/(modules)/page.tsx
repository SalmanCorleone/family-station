import PageHeader from '@/components/pageHeader';
import DashboardContainer from './_components/DashboardContainer';
import { getDashboardData } from './actions';
import { Suspense } from 'react';
import SimpleLoader from '@/components/simpleLoader';

const Home = async () => {
  const dashboardPromise = getDashboardData();

  return (
    <div className="flex flex-col">
      <PageHeader title="Dashboard" />

      <Suspense fallback={<SimpleLoader />}>
        <DashboardContainer dashboardPromise={dashboardPromise} />
      </Suspense>
    </div>
  );
};

export default Home;
