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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <Image
              src="/main-logo.jpg"
              alt="Art Auction Logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] object-cover"
            />
            <span className="font-semibold text-lg">BidBuddy.com</span>
          </Link>

          {/* Навігація */}
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:underline">
              All Auctions
            </Link>

            {/* Ці два посилання бачать тільки авторизовані */}
            {session?.user && (
              <>
                <Link href="/items/create" className="hover:underline">
                  Create Auction
                </Link>
                <Link href="/auctions" className="hover:underline">
                  My Auctions
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Правий блок: ім’я + кнопка */}
        <div className="flex items-center gap-3 px-4">
          {session?.user && (
            <div className="text-gray-700 font-medium">{session.user.name}</div>
          )}
          <div>{session ? <SignOut /> : <SignIn />}</div>
        </div>
      </div>
    </div>
  );
}
