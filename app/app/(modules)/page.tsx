import MyFamily from './_components/myFamily';

const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MyFamily />
      </div>
    </div>
  );
};

export default Home;
