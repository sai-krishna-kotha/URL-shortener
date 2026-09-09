import { useState } from 'react';
import { api } from '../services/api';
import StatsSearch from '../components/analytics/StatsSearch';
import StatsOverview from '../components/analytics/StatsOverview';
import UrlDetails from '../components/analytics/UrlDetails';
import StatsEmptyState from '../components/analytics/StatsEmptyState';

export default function Stats() {
  const [shortCode, setShortCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!shortCode.trim()) return;

    setIsSearching(true);
    setError('');
    setStats(null);
    
    try {
      const data = await api.getUrlStats(shortCode.trim());
      setStats(data);
    } catch (err) {
      if (err.status === 404) {
        setError('Short code not found.');
      } else if (err.status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (!err.status) {
        setError('Unable to connect to the server.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Analytics
        </h1>
        <p className="text-gray-600 text-lg">Track performance for your shortened URL.</p>
      </div>

      <StatsSearch 
        shortCode={shortCode} 
        setShortCode={setShortCode} 
        isSearching={isSearching} 
        onSearch={handleSearch} 
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center shadow-sm">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {stats && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StatsOverview stats={stats} />
          <UrlDetails stats={stats} />
        </div>
      )}

      {!stats && !error && !isSearching && (
        <StatsEmptyState />
      )}
    </div>
  );
}
