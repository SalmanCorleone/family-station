interface IPageHeaderProps {
  title: string;
  renderLeft?: React.ReactNode;
  renderRight?: React.ReactNode;
}

const PageHeader = ({ title, renderLeft, renderRight }: IPageHeaderProps) => {
  return (
    <div className="flex gap-2 items-center p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div>{renderLeft}</div>
      </div>
      <div>{renderRight}</div>
    </div>
  );
};

export default PageHeader;
