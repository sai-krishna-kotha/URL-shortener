import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

export default function ShortUrlResult({ shortUrl, originalUrl }) {
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

  return (
    <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-900 mb-3">Your shortened URL is ready!</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white px-4 py-3 rounded-lg border border-indigo-200 shadow-sm">
          <a 
            href={shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium truncate hover:underline flex items-center gap-2"
          >
            {shortUrl}
            <ExternalLink className="w-4 h-4 opacity-50" />
          </a>
        </div>
        <Button 
          onClick={handleCopy} 
          className="flex-shrink-0 w-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </>
          )}
        </Button>
      </div>
      <p className="mt-3 text-xs text-indigo-700 truncate">
        Redirects to: <span className="opacity-80">{originalUrl}</span>
      </p>
    </div>
  );
}
