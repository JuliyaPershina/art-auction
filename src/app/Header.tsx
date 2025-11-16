'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  NotificationCell,
  NotificationFeedPopover,
  NotificationIconButton,
} from '@knocklabs/react';
import { useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { formatToDollar } from '@/util/currency';

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const { data: session, status } = useSession();

  const user = session?.user;
  const userId = user?.id;
  // console.log("session:", session);

  return (
    <header className="bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container flex justify-between items-center py-4 px-4">
        {/* 🔹 Ліва частина — логотип і навігація */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 hover:underline">
            <Image
              src="/main-logo.jpg"
              alt="Art Auction Logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              BidBuddy.com
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="hover:underline text-gray-700 dark:text-gray-200"
            >
              All Auctions
            </Link>
            {user && (
              <>
                <Link
                  href="/items/create"
                  className="hover:underline text-gray-700 dark:text-gray-200"
                >
                  Create Auction
                </Link>
                <Link
                  href="/auctions"
                  className="hover:underline text-gray-700 dark:text-gray-200"
                >
                  My Auctions
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* 🔸 Права частина — нотифікації, ім’я користувача, аватар, кнопки */}
        <div className="flex items-center gap-4">
          {/* 🔔 Knock Notifications */}
          {user && (
            <>
              <NotificationIconButton
                ref={notifButtonRef}
                onClick={() => setIsVisible(!isVisible)}
              />
              <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                renderItem={({ item, ...props }) => {
                  const data = item.data;

                  if (!data) {
                    return (
                      <NotificationCell {...props} item={item} key={item.id}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="text-gray-500 text-sm italic">
                            No item data
                          </div>
                        </div>
                      </NotificationCell>
                    );
                  }

                  return (
                    <NotificationCell {...props} item={item} key={item.id}>
                      <div className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                        {/* 🔔 Іконка */}
                        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600 dark:text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                        </div>

                        {/* 📝 Текст повідомлення */}
                        <div className="flex-1">
                          <div className="text-gray-800 dark:text-gray-100 font-medium">
                            Someone outbid you on{' '}
                            <span className="font-semibold">
                              {data.itemName}
                            </span>
                            !
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            New bid: {formatToDollar(data.amount)}
                          </div>
                        </div>

                        {/* 🔗 Кнопка перегляду */}
                        <Link
                          href={`/items/${data.itemId}`}
                          onClick={() => setIsVisible(false)}
                          className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                        >
                          View item →
                        </Link>
                      </div>
                    </NotificationCell>
                  );
                }}
              />
            </>
          )}

          {/* 👤 Ім’я користувача + аватар */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-gray-700 dark:text-gray-200 font-medium">
                {user.name}
              </div>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? 'User Avatar'}
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300 dark:border-gray-700"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold uppercase">
                  {user.name ? user.name[0] : '?'}
                </div>
              )}
            </div>
          )}

          {/* 🔘 Вхід / Вихід */}
          <div>
            {user ? (
              <Button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            ) : (
              <Button type="button" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
