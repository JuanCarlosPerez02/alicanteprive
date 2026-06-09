export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="min-h-[88vh] bg-primary flex flex-col items-center justify-center gap-6 px-6">
        <div className="h-3 w-24 bg-primary-foreground/10 rounded-sm animate-pulse" />
        <div className="h-12 w-full max-w-2xl bg-primary-foreground/10 rounded-sm animate-pulse" />
        <div className="h-8 w-80 bg-primary-foreground/10 rounded-sm animate-pulse" />
        <div className="flex gap-4 mt-2">
          <div className="h-12 w-40 bg-gold/20 rounded-sm animate-pulse" />
          <div className="h-12 w-32 bg-primary-foreground/10 rounded-sm animate-pulse" />
        </div>
      </div>

      {/* Featured properties skeleton */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 space-y-3">
          <div className="h-3 w-24 bg-muted rounded-sm mx-auto animate-pulse" />
          <div className="h-8 w-64 bg-muted rounded-sm mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="h-56 bg-muted animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-muted rounded-sm animate-pulse" />
                <div className="h-5 w-full bg-muted rounded-sm animate-pulse" />
                <div className="h-7 w-32 bg-muted rounded-sm animate-pulse" />
                <div className="flex gap-4 pt-2 border-t border-border">
                  <div className="h-4 w-12 bg-muted rounded-sm animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded-sm animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded-sm animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
