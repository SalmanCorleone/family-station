const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4 rounded-lg bg-white shadow-lg">
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
};

export default PageHeader;
