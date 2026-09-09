import { useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Search, BarChart3, Clock, Link as LinkIcon, MousePointerClick, Calendar, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

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
        setError('Short code not found. Please check and try again.');
      } else {
        setError(err.message || 'Failed to load analytics.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">Enter a short code to view real-time click statistics and lifecycle data.</p>
      </div>

      <Card className="p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <InputField
              label="Short Code"
              id="shortCode"
              type="text"
              placeholder="e.g. my-campaign"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isSearching} className="mb-[2px]">
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center mb-8">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 col-span-1 md:col-span-2 bg-indigo-600 text-white border-none shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-indigo-200 text-sm font-medium mb-1">Total Clicks</p>
                <div className="text-5xl font-extrabold">{stats.clicks}</div>
              </div>
              <div className="bg-indigo-500/30 p-4 rounded-lg flex-1 sm:max-w-xs">
                <p className="text-indigo-200 text-xs font-medium mb-1">Target URL</p>
                <a href={stats.target_url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline truncate block flex items-center gap-1">
                  {stats.target_url} <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">Short Link</p>
              <a href={stats.short_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-semibold truncate block hover:text-indigo-600">
                {stats.short_url}
              </a>
              <div className="mt-2 text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stats.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {stats.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex items-start gap-4">
            <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Timeline</p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-900"><span className="text-gray-500 mr-2">Created:</span> {new Date(stats.created_at).toLocaleString()}</p>
                <p className="text-sm text-gray-900"><span className="text-gray-500 mr-2">Expires:</span> {stats.expires_at ? new Date(stats.expires_at).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!stats && !error && !isSearching && (
        <div className="text-center py-16">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No analytics loaded</h3>
          <p className="text-gray-500 mt-1">Search for a short code above to see its performance.</p>
        </div>
      )}
    </div>
  );
}
