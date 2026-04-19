export function ShopCardSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3 animate-pulse">
      <div className="w-10 h-10 rounded-2xl bg-black/[0.06] dark:bg-white/[0.08] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] w-3/4" />
        <div className="h-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] w-1/2" />
      </div>
      <div className="h-4 w-10 rounded-full bg-black/[0.04] dark:bg-white/[0.06]" />
    </div>
  )
}
