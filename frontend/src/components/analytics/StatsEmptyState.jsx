import { BarChart3 } from 'lucide-react';

export default function StatsEmptyState() {
  return (
    <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-6 sm:mt-8">
      <div className="bg-indigo-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Check your URL performance</h3>
      <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-sm mx-auto leading-6">
        Enter a short code above to view clicks, timeline, and complete URL details.
      </p>
    </div>
  );
}
