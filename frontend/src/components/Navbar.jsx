import { Link, useLocation } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          aria-label="URL Shortener Home"
        >
          <LinkIcon className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-gray-900">URL Shortener</span>
        </Link>
        <nav className="flex gap-4">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/stats" 
            className={`text-sm font-medium transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              location.pathname === '/stats' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}
