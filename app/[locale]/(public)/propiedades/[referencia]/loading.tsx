export default function PropiedadLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <div className="h-4 w-24 bg-muted rounded-sm animate-pulse" />
        <div className="h-4 w-4 bg-muted rounded-sm animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded-sm animate-pulse" />
      </div>

      {/* Gallery skeleton */}
      <div className="mb-8 h-[480px] bg-muted rounded-sm animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-muted rounded-sm animate-pulse" />
            <div className="h-10 w-full bg-muted rounded-sm animate-pulse" />
            <div className="h-10 w-2/3 bg-muted rounded-sm animate-pulse" />
            <div className="h-8 w-40 bg-muted rounded-sm animate-pulse" />
          </div>

          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-24 bg-muted rounded-sm animate-pulse" />
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded-sm animate-pulse" />
            <div className="h-4 w-full bg-muted rounded-sm animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded-sm animate-pulse" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="h-64 bg-muted rounded-sm animate-pulse" />
          <div className="h-80 bg-muted rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
