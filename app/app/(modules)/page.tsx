import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex flex-col lg:flex-row items-center justify-center h-[300px] border gap-4">
        <Link href="/app/chat">
          <div className="p-4 rounded border">Chat</div>
        </Link>
        <Link href="/app/budget">
          <div className="p-4 rounded border">Budget</div>
        </Link>
        <Link href="/app/todo">
          <div className="p-4 rounded border">To do</div>
        </Link>
        <Link href="/app/account">
          <div className="p-4 rounded border">Account</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
