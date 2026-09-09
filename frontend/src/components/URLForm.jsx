import { useState } from 'react';
import InputField from './InputField';
import Button from './Button';
import ShortUrlResult from './ShortUrlResult';
import { isValidUrl, isValidAlias } from '../utils/validation';

export default function URLForm() {
  const [targetUrl, setTargetUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { shortUrl, originalUrl }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Phase 7: Simulate API call. Will be replaced in Phase 8.
    setTimeout(() => {
      setIsSubmitting(false);
      setResult({
        shortUrl: `http://localhost:8000/${customAlias || 'xyz123'}`,
        originalUrl: targetUrl
      });
      // Clear form
      setTargetUrl('');
      setCustomAlias('');
      setExpiresAt('');
    }, 800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
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
