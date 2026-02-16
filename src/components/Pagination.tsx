import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // '/blog'
}

function generatePagination(current: number, total: number) {
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  let last: number | undefined;

  for (const page of range) {
    if (last) {
      if (Number(page) - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (Number(page) - last > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(page);
    last = Number(page);
  }

  return rangeWithDots;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 pt-12">
      {/* PREV */}
      {currentPage > 1 ? (
        <Link
          href={
            currentPage - 1 === 1
              ? basePath
              : `${basePath}?page=${currentPage - 1}`
          }
          rel="prev"
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded-lg opacity-40">← Prev</span>
      )}

      {/* NUMBERS */}
      {pages.map((p, index) =>
        p === '...' ? (
          <span key={`dots-${index}`} className="px-4 py-2">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={p === 1 ? basePath : `${basePath}?page=${p}`}
            className={`px-4 py-2 border rounded-lg ${
              p === currentPage
                ? 'bg-black text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {/* NEXT */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          rel="next"
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded-lg opacity-40">Next →</span>
      )}
    </div>
  );
}
