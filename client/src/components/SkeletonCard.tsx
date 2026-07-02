/** Loading placeholder mirroring ProductCard's layout for zero layout shift. */
export function SkeletonCard() {
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="skeleton h-3 w-1/3 rounded-full" />
        <div className="skeleton h-4 w-5/6 rounded-full" />
        <div className="skeleton h-4 w-2/3 rounded-full" />
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-2xl" />
        </div>
        <div className="skeleton mt-1 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
