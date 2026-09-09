import { Search } from 'lucide-react';
import Card from '../Card';
import InputField from '../InputField';
import Button from '../Button';

export default function StatsSearch({ shortCode, setShortCode, isSearching, onSearch }) {
  return (
    <Card className="p-6 mb-8">
      <form onSubmit={onSearch} className="flex gap-4 items-end">
        <div className="flex-1">
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
        <Button type="submit" disabled={isSearching} className="mb-[2px]">
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'View analytics'}
        </Button>
      </form>
    </Card>
  );
}
