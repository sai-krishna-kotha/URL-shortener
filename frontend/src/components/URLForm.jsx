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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {apiError}
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
          className="w-full text-lg py-3 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Shortening...' : 'Shorten URL'}
        </Button>
      </form>

      {result && <ShortUrlResult shortUrl={result.shortUrl} originalUrl={result.originalUrl} />}
    </div>
  );
}
