// import Image from 'next/image';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-screen gap-4">
      <Link href="/chat">
        <div className="p-4 rounded border">Chat</div>
      </Link>
      <Link href="/budget">
        <div className="p-4 rounded border">Budget</div>
      </Link>
      <Link href="/todo">
        <div className="p-4 rounded border">To do</div>
      </Link>
    </div>
  );
}
