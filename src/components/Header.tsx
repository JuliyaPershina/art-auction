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
import { FaLaptopCode, FaTimes, FaBars } from 'react-icons/fa';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  locale: 'hu' | 'en';
}

export function Header({ locale }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const { data: session } = useSession();

  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-gray-100 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="w-full flex items-center justify-between gap-12 py-4 px-6">
        {/* 🔹 Ліва частина — логотип і навігація */}
        <div className="flex items-center gap-12 flex-1 justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Image
              src="/main-logo.jpg"
              alt="Art Auction Logo"
              width={50}
              height={50}
              className="w-12.5 h-12.5 object-cover rounded-full"
            />
            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Anikó Kocsis
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href={`/${locale}/allAuctions`}
              className="hover:underline text-gray-700 dark:text-gray-200"
            >
              {locale === 'hu' ? 'Aukciók' : 'Auctions'}
            </Link>

            {user && (
              <>
                <Link
                  href={`/${locale}/auctions`}
                  className="hover:underline text-gray-700 dark:text-gray-200"
                >
                  {locale === 'hu' ? 'Az Ajánlataimat' : 'My Bids'}
                </Link>
              </>
            )}

            <Link
              href={`/${locale}/blog`}
              className="hover:underline text-gray-700 dark:text-gray-200"
            >
              {locale === 'hu' ? 'Blog' : 'Blog'}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="hover:underline text-gray-700 dark:text-gray-200"
            >
              {locale === 'hu' ? 'Kapcsolat' : 'Contact'}
            </Link>

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
                    if (!data) return null;

                    let title = '';
                    let link = '#';

                    switch (data.type) {
                      case 'auction-won':
                        title = `🎉 You won "${data.itemName}" for ${formatToDollar(data.amount)}`;
                        link = data.url;
                        break;

                      case 'auction-won-admin':
                        title = `🏁 ${data.winnerName} won "${data.itemName}"`;
                        link = data.url;
                        break;

                      case 'outbid-in-app':
                        title = `Someone outbid you on "${data.itemName}" (${formatToDollar(Number(data.amount))})`;
                        link = `/${locale}/items/${data.itemId}`;
                        break;

                      case 'auction-lost':
                        title = `Auction ended — you lost "${data.itemName}"`;
                        link = `/${locale}/items/${data.itemId}`;
                        break;

                      default:
                        title = 'Notification';
                    }

                    return (
                      <NotificationCell {...props} item={item} key={item.id}>
                        <div className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                          {/* <div className="flex-1">
                            <div className="text-gray-800 dark:text-gray-100 font-medium">
                              {title}
                            </div>
                          </div> */}

                          <Link
                            href={link}
                            onClick={() => setIsVisible(false)}
                            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                          >
                            View →
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
          </nav>

          {/* Навігація для мобільних */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              title="Menu"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
          {/* Випадаюче мобільне меню */}
          {menuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="flex flex-col items-center p-6 space-y-4 text-gray-800 dark:text-gray-200">
                <Link
                  href={`/${locale}/allAuctions`}
                  className="hover:underline text-gray-700 dark:text-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {locale === 'hu' ? 'Összes aukció' : 'All Auctions'}
                </Link>

                {/* My Bids */}
                {user && (
                  <>
                    <Link
                      href={`/${locale}/auctions`}
                      className="hover:underline text-gray-700 dark:text-gray-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      {locale === 'hu' ? 'Az Ajánlataimat' : 'My Bids'}
                    </Link>
                  </>
                )}

                <Link
                  href={`/${locale}/blog`}
                  className="hover:underline text-gray-700 dark:text-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {locale === 'hu' ? 'Blog' : 'Blog'}
                </Link>

                <Link
                  href={`/${locale}/contact`}
                  className="hover:underline text-gray-700 dark:text-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {locale === 'hu' ? 'Kapcsolat' : 'Contact'}
                </Link>

                <div className="flex flex-wrap justify-between items-center gap-4 w-full pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div>
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
                            if (!data) return null;

                            let title = '';
                            let link = '#';

                            switch (data.type) {
                              case 'auction-won':
                                title = `🎉 You won "${data.itemName}" for ${formatToDollar(data.amount)}`;
                                link = data.url;
                                break;

                              case 'auction-won-admin':
                                title = `🏁 ${data.winnerName} won "${data.itemName}"`;
                                link = data.url;
                                break;

                              case 'outbid-in-app':
                                title = `Someone outbid you on "${data.itemName}" (${formatToDollar(Number(data.amount))})`;
                                link = `/${locale}/items/${data.itemId}`;
                                break;

                              case 'auction-lost':
                                title = `Auction ended — you lost "${data.itemName}"`;
                                link = `/${locale}/items/${data.itemId}`;
                                break;

                              default:
                                title = 'Notification';
                            }

                            return (
                              <NotificationCell
                                {...props}
                                item={item}
                                key={item.id}
                              >
                                <div className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                                  {/* <div className="flex-1">
                                    <div className="text-gray-800 dark:text-gray-100 font-medium">
                                      {title}
                                    </div>
                                  </div> */}

                                  <Link
                                    href={link}
                                    onClick={() => setIsVisible(false)}
                                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                  >
                                    View →
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
                  </div>
                  <div className="md:hidden flex items-center gap-4">
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
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden  md:flex  items-center gap-4">
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
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
