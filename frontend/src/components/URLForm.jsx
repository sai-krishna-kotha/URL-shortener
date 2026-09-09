import { useState } from 'react';
import InputField from './InputField';
import Button from './Button';
import ShortUrlResult from './ShortUrlResult';
import { isValidUrl, isValidAlias } from '../utils/validation';
import { api } from '../services/api';

export default function URLForm() {
  const [targetUrl, setTargetUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!targetUrl) {
      newErrors.targetUrl = 'Target URL is required';
    } else if (!isValidUrl(targetUrl)) {
      newErrors.targetUrl = 'Please enter a valid HTTP/HTTPS URL';
    }

    if (customAlias && !isValidAlias(customAlias)) {
      newErrors.customAlias = 'Alias must be 3-30 chars (letters, numbers, hyphens, underscores)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setResult(null);

    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      // If expiresAt is set, convert local datetime to UTC ISO string to send to backend if needed,
      // but backend parses datetime strings. Standard HTML datetime-local is YYYY-MM-DDTHH:mm
      // We can append :00Z or just pass as is if backend parses it well. Let's pass as is to let pydantic handle it.
      let finalExpiresAt = expiresAt;
      if (finalExpiresAt) {
          finalExpiresAt = new Date(finalExpiresAt).toISOString();
      }

      const response = await api.createShortUrl({
        target_url: targetUrl,
        custom_alias: customAlias,
        expires_at: finalExpiresAt
      });
      
      setResult({
        shortUrl: response.short_url,
        originalUrl: response.target_url,
        clicks: response.clicks,
        expiresAt: response.expires_at
      });

      // Clear form
      setTargetUrl('');
      setCustomAlias('');
      setExpiresAt('');

    } catch (err) {
      if (err.status === 409) {
        setApiError("That custom alias is already in use.");
      } else if (err.status === 429) {
        setApiError("Rate limit exceeded. Please try again later.");
      } else {
        setApiError(err.message || "Failed to create short URL. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start shadow-sm">
            <svg className="w-5 h-5 mr-2.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{apiError}</span>
          </div>
        )}

        <InputField
          label="Target URL"
          id="targetUrl"
          type="url"
          placeholder="https://example.com/very/long/path/to/shorten"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          error={errors.targetUrl}
          required
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Custom Alias (Optional)"
            id="customAlias"
            type="text"
            placeholder="my-campaign"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            error={errors.customAlias}
          />
          
          <InputField
            label="Expiration (Optional)"
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full text-lg py-3 mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </span>
          ) : 'Shorten URL'}
        </Button>
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ShortUrlResult 
            shortUrl={result.shortUrl} 
            originalUrl={result.originalUrl} 
            clicks={result.clicks} 
            expiresAt={result.expiresAt} 
          />
        </div>
      )}
    </div>
  );
}
