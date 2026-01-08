'use client';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-4">Access Denied</p>
        <p className="text-gray-500 mb-8">
          You don't have permission to access this resource.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
