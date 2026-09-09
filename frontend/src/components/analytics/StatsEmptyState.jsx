import { BarChart3 } from 'lucide-react';

export default function StatsEmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm mt-8">
      <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Check your URL performance</h3>
      <p className="text-gray-500 mt-2 max-w-sm mx-auto">
        Enter a short code above to view clicks, timeline, and complete URL details.
      </p>
    </div>
  );
}
