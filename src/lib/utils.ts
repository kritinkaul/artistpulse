/**
 * Formats large numbers into more readable format
 * @param num - Number to format (can be string or number)
 * @returns Formatted string (e.g., 1.2B, 345M, 12.5K)
 */
export function formatNumber(num: string | number): string {
  const number = typeof num === 'string' ? parseInt(num) : num;
  
  if (isNaN(number)) return '0';
  
  if (number >= 1000000000) {
    const billions = number / 1000000000;
    return billions % 1 === 0 ? billions.toFixed(0) + 'B' : billions.toFixed(1) + 'B';
  } else if (number >= 1000000) {
    const millions = number / 1000000;
    return millions % 1 === 0 ? millions.toFixed(0) + 'M' : millions.toFixed(1) + 'M';
  } else if (number >= 1000) {
    const thousands = number / 1000;
    return thousands % 1 === 0 ? thousands.toFixed(0) + 'K' : thousands.toFixed(1) + 'K';
  }
  
  return number.toString();
}

/**
 * Formats a date string to show relative time
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}
