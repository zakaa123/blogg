export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Page Not Found</h1>
        <p className="text-secondary-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Let us help you find what you need.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/"
            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            Go Home
          </a>
          <a
            href="/search"
            className="bg-secondary-100 text-secondary-700 px-6 py-3 rounded-xl font-medium hover:bg-secondary-200 transition-colors"
          >
            Search Articles
          </a>
        </div>
      </div>
    </div>
  );
}
