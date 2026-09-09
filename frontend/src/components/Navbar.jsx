import { Link } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
          <LinkIcon className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-gray-900">URL Shortener</span>
        </Link>
        <nav>
          <Link 
            to="/stats" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}
