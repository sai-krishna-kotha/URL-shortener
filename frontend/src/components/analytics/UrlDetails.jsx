import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { formatDate } from '../../utils/formatDate';

export default function UrlDetails({ stats }) {
  const [copied, setCopied] = useState(false);

  if (!stats) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(stats.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleOpen = () => {
    window.open(stats.short_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-base font-medium text-gray-900">URL Information</h3>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row w-full sm:w-auto">
          <Button variant="secondary" onClick={handleCopy} className="text-xs sm:text-sm py-2 w-full sm:w-auto">
            {copied ? (
              <><Check className="w-4 h-4 mr-2 text-green-600" />Copied</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" />Copy URL</>
            )}
          </Button>
          <Button onClick={handleOpen} className="text-xs sm:text-sm py-2 w-full sm:w-auto">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open URL
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 grid grid-cols-[minmax(96px,140px)_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-500 pt-0.5">Short URL</dt>
            <dd className="text-sm text-gray-900 font-medium min-w-0 break-all">
              <a href={stats.short_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {stats.short_url}
              </a>
            </dd>
          </div>

          <div className="py-4 grid grid-cols-[minmax(96px,140px)_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-500 pt-0.5">Target URL</dt>
            <dd className="text-sm text-gray-900 min-w-0 break-all">
              <a href={stats.target_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-600" title={stats.target_url}>
                {stats.target_url}
              </a>
            </dd>
          </div>

          <div className="py-4 grid grid-cols-[minmax(96px,140px)_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-500 pt-0.5">Created At</dt>
            <dd className="text-sm text-gray-900 min-w-0 break-words">{formatDate(stats.created_at)}</dd>
          </div>

          <div className="py-4 grid grid-cols-[minmax(96px,140px)_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-500 pt-0.5">Expiration</dt>
            <dd className="text-sm text-gray-900 min-w-0 break-words">{formatDate(stats.expires_at)}</dd>
          </div>

          <div className="py-4 grid grid-cols-[minmax(96px,140px)_minmax(0,1fr)] sm:grid-cols-[170px_minmax(0,1fr)] gap-4 sm:gap-6 items-start">
            <dt className="text-xs sm:text-sm font-medium text-gray-500 pt-0.5">Status</dt>
            <dd className="text-sm text-gray-900 min-w-0">{stats.is_active ? 'Active' : 'Inactive'}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
