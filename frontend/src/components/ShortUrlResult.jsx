import { Copy, Check, ExternalLink, Calendar, MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

export default function ShortUrlResult({ shortUrl, originalUrl, clicks, expiresAt }) {
  const [copied, setCopied] = useState(false);

  if (!shortUrl) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formattedDate = expiresAt 
    ? new Date(expiresAt).toLocaleString() 
    : 'Never';

  return (
    <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-900 mb-3">Your shortened URL is ready!</h3>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center bg-white px-4 py-3 rounded-lg border border-indigo-200 shadow-sm overflow-hidden">
          <span className="text-indigo-600 font-medium truncate block w-full">{shortUrl}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopy} className="flex-shrink-0 flex-1 sm:flex-none">
            {copied ? <><Check className="w-4 h-4 mr-2" />Copied</> : <><Copy className="w-4 h-4 mr-2" />Copy</>}
          </Button>
          <Button variant="secondary" className="flex-shrink-0 flex-1 sm:flex-none" onClick={() => window.open(shortUrl, '_blank', 'noopener,noreferrer')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-indigo-100 text-sm text-gray-600 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">Target:</span>
          <span className="truncate ml-4 max-w-[70%]">{originalUrl}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500 flex items-center gap-1"><MousePointerClick className="w-4 h-4"/> Clicks:</span>
          <span>{clicks || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4"/> Expires:</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
