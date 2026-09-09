import { useState } from 'react';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Search, BarChart3, Clock, Link as LinkIcon, MousePointerClick } from 'lucide-react';

export default function Stats() {
  const [shortCode, setShortCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!shortCode.trim()) return;

    setIsSearching(true);
    
    // Phase 7: Simulate API call. Will be wired to real API in Phase 9.
    setTimeout(() => {
      setIsSearching(false);
      setSearched(true);
    }, 600);
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

      {searched ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">
            Stats UI foundation created. Real API integration planned for Phase 8/9.
          </p>
        </div>
      ) : (
        <div className="text-center py-16">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No analytics loaded</h3>
          <p className="text-gray-500 mt-1">Search for a short code above to see its performance.</p>
        </div>
      )}
    </div>
  );
}
