import SignIn from '@/components/sign-in';
import { SignOut } from '@/components/signout-button';
import Image from 'next/image';
import { auth } from '../../auth';
import Link from 'next/link';

export async function Header() {
  const session = await auth();
  return (
    <div className="bg-gray-100">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-12 py-4 px-4">
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <Image
              src="/main-logo.jpg"
              alt="Art Auction Logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] object-cover"
            />
            BidBuddy.com
          </Link>

          <div>
            <Link
              href="/items/create "
              className="flexitems-center gap-2 hover:underline"
            >
              Auction an Item
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>{session?.user?.name}</div>
          <div>{session ? <SignOut /> : <SignIn />}</div>
        </div>
      </div>
    </div>
  );
}
