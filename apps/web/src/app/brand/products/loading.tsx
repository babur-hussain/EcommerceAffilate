export default function LoadingBrandProducts() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded mt-2 animate-pulse" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="h-5 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
