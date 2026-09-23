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
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-indigo-50/80 rounded-2xl border border-indigo-100 shadow-sm">
      <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-start gap-1.5 leading-5">
        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
        <span>Your shortened URL is ready!</span>
      </h3>

      <div className="flex flex-col gap-3 mb-5">
        <div className="w-full flex items-center bg-white px-3 sm:px-4 py-3.5 rounded-xl border border-indigo-200 shadow-inner overflow-hidden min-h-[52px]">
          <span className="text-indigo-600 font-medium truncate block w-full text-base sm:text-lg">
            {shortUrl}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
          <Button onClick={handleCopy} className="w-full sm:w-auto min-w-0">
            {copied ? (
              <><Check className="w-4 h-4 mr-2" />Copied ✓</>
            ) : (
              <><Copy className="w-4 h-4 mr-2" />Copy URL</>
            )}
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => window.open(shortUrl, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-100 text-sm text-gray-600 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="font-medium text-gray-500 sm:w-20 flex-shrink-0">Target:</span>
          <span className="break-all sm:truncate min-w-0">{originalUrl}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-gray-500 flex items-center gap-1">
            <MousePointerClick className="w-4 h-4" />
            Clicks:
          </span>
          <span>{clicks || 0}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Expires:
          </span>
          <span className="text-right break-words">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
