export default function ContactoLoading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <div className="h-3 w-24 bg-muted rounded-sm mx-auto animate-pulse" />
        <div className="h-10 w-40 bg-muted rounded-sm mx-auto animate-pulse" />
        <div className="h-4 w-80 bg-muted rounded-sm mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Contact info */}
        <div className="md:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 bg-muted rounded-sm animate-pulse" />
              <div className="h-4 w-36 bg-muted rounded-sm animate-pulse" />
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="md:col-span-3 bg-card border border-border rounded-sm p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-24 bg-muted rounded-sm animate-pulse" />
              <div className={`bg-muted rounded-sm animate-pulse ${i === 4 ? 'h-24' : 'h-10'}`} />
            </div>
          ))}
          <div className="h-12 w-full bg-muted rounded-sm animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
}
