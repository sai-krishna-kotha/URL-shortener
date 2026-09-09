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
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-900">URL Information</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopy} className="text-sm py-2">
            {copied ? <><Check className="w-4 h-4 mr-2 text-green-600" />Copied</> : <><Copy className="w-4 h-4 mr-2" />Copy URL</>}
          </Button>
          <Button onClick={handleOpen} className="text-sm py-2">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open URL
          </Button>
        </div>
      </div>
      
      <div className="p-0">
        <dl className="divide-y divide-gray-200">
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Short URL</dt>
            <dd className="text-sm text-gray-900 sm:col-span-2 font-medium">
              <a href={stats.short_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {stats.short_url}
              </a>
            </dd>
          </div>
          
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Target URL</dt>
            <dd className="text-sm text-gray-900 sm:col-span-2">
              <a href={stats.target_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-600 break-all" title={stats.target_url}>
                {stats.target_url}
              </a>
            </dd>
          </div>

          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="text-sm text-gray-900 sm:col-span-2">{formatDate(stats.created_at)}</dd>
          </div>

          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Expiration</dt>
            <dd className="text-sm text-gray-900 sm:col-span-2">{formatDate(stats.expires_at)}</dd>
          </div>

          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="text-sm text-gray-900 sm:col-span-2">
              {stats.is_active ? 'Active' : 'Inactive'}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
