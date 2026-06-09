export default function PropiedadesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-muted rounded-sm animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded-sm animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted rounded-sm animate-pulse" />
        ))}
      </div>

      {/* Results count */}
      <div className="h-4 w-40 bg-muted rounded-sm animate-pulse mb-6" />

      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="h-56 bg-muted animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-muted rounded-sm animate-pulse" />
              <div className="h-5 w-full bg-muted rounded-sm animate-pulse" />
              <div className="h-5 w-3/4 bg-muted rounded-sm animate-pulse" />
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
    </div>
  );
}
