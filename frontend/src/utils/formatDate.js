export function formatDate(isoString) {
  if (!isoString) return 'Never';
  
  try {
    const date = new Date(isoString);
    // Check for invalid date
    if (isNaN(date.getTime())) return 'Invalid Date';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  } catch (err) {
    return 'Unknown';
  }
}
