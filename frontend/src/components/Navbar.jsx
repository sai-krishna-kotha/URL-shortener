import { Link, useLocation } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1 min-w-0"
          aria-label="URL Shortener Home"
        >
          <LinkIcon className="w-6 h-6 flex-shrink-0" />
          <span className="font-bold text-base sm:text-xl tracking-tight text-gray-900 truncate">
            URL Shortener
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4" aria-label="Primary navigation">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              location.pathname === '/'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/stats"
            className={`text-sm font-medium transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              location.pathname === '/stats'
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}
