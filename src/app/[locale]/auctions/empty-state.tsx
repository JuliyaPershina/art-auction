import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export async function EmptyState({
  params,
}: {
  params: Promise<{ locale: 'hu' | 'en' }>;
}) {
  const { locale } = await params;
  const t = {
    noAuctions:
      locale === 'hu' ? 'Még nincsenek aukcióid' : 'You have no Auctions yet',
    create: locale === 'hu' ? 'Aukció létrehozása' : 'Create Auction',
  };
  return (
    <div className="space-y-8 flex flex-col items-center justify-center mt-20">
      <Image src="/pacage.svg" width={200} height={200} alt="Pacage" />
      <h2 className="text-2xl font-bold">{t.noAuctions}</h2>
      <Button asChild>
        <Link href={`/${locale}/items/create`}>{t.create}</Link>
      </Button>
    </div>
  );
}
