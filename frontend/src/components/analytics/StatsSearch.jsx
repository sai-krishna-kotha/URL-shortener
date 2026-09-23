import { Search } from 'lucide-react';
import Card from '../Card';
import InputField from '../InputField';
import Button from '../Button';

export default function StatsSearch({ shortCode, setShortCode, isSearching, onSearch }) {
  return (
    <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
      <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
        <div className="flex-1 min-w-0">
          <InputField
            label="Enter short code:"
            id="shortCode"
            type="text"
            placeholder="e.g. my-campaign"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isSearching} className="w-full sm:w-auto whitespace-nowrap">
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'View analytics'}
        </Button>
      </form>
    </Card>
  );
}
