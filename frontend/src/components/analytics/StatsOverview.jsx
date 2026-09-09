import Card from '../Card';
import { formatDate } from '../../utils/formatDate';

export default function StatsOverview({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-5 border-indigo-100 bg-indigo-50/50">
        <p className="text-sm font-medium text-indigo-600 mb-1">Total Clicks</p>
        <p className="text-3xl font-bold text-indigo-900">{stats.clicks || 0}</p>
      </Card>
      
      <Card className="p-5">
        <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
        <div className="mt-1">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
            stats.is_active 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stats.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {stats.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
        <p className="text-lg font-semibold text-gray-900">{formatDate(stats.created_at).split(',')[0]}</p>
      </Card>

      <Card className="p-5">
        <p className="text-sm font-medium text-gray-500 mb-1">Expires</p>
        <p className="text-lg font-semibold text-gray-900">
          {stats.expires_at ? formatDate(stats.expires_at).split(',')[0] : 'Never'}
        </p>
      </Card>
    </div>
  );
}
