'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createBidAction } from '@/app/[locale]/items/[itemId]/actions';

export default function PlaceBidButton({
  locale,
  itemId,
  currentBid,
}: {
  locale: 'hu' | 'en';
  itemId: number;
  currentBid: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const t = {
    confirm:
      locale === 'hu'
        ? 'Biztosan licitálni szeretnél?'
        : 'Are you sure you want to place a bid?',
    amount: locale === 'hu' ? 'Licit összege' : 'Bid amount',
    cancel: locale === 'hu' ? 'Mégse' : 'Cancel',
    confirmBtn: locale === 'hu' ? 'Megerősítés' : 'Confirm',
    loading: locale === 'hu' ? 'Feldolgozás...' : 'Processing...',
  };

  return (
    <>
      {/* MAIN BUTTON */}
      <Button
        className="w-full text-lg py-6 shadow-lg"
        onClick={() => setOpen(true)}
      >
        {locale === 'hu' ? 'Licitálás' : 'Place a Bid'}
      </Button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md space-y-6 shadow-xl">
            <h2 className="text-xl font-semibold">{t.confirm}</h2>

            <p className="text-gray-500">
              {t.amount}: <span className="font-bold">${currentBid / 100}</span>
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>

              <Button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await createBidAction(locale, itemId);
                    setOpen(false);
                  });
                }}
              >
                {isPending ? t.loading : t.confirmBtn}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
