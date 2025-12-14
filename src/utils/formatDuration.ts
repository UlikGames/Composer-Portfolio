/**
 * Format duration for display
 * Supports both number (minutes) and string (MM:SS or HH:MM:SS) formats
 * 
 * @param duration - Duration as number (minutes) or string (MM:SS or HH:MM:SS)
 * @returns Formatted duration string
 * 
 * @example
 * formatDuration(2.37) // "2:22"
 * formatDuration("02:22") // "2:22"
 * formatDuration("1:02:22") // "1:02:22"
 */
export function formatDuration(duration: number | string): string {
  if (typeof duration === 'string') {
    // If it's already a string, return it as-is (or format it)
    // Remove leading zeros from minutes if present
    const parts = duration.split(':');
    if (parts.length === 2) {
      // MM:SS format
      const minutes = parseInt(parts[0], 10);
      const seconds = parts[1];
      return `${minutes}:${seconds}`;
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return duration;
    }
    return duration;
  }

  // If it's a number, convert minutes to MM:SS format
  const totalSeconds = Math.round(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format duration for short display (e.g., "2:22" or "2 min")
 * 
 * @param duration - Duration as number (minutes) or string (MM:SS)
 * @returns Short formatted duration string
 */
export function formatDurationShort(duration: number | string): string {
  if (typeof duration === 'string') {
    const parts = duration.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      return `${minutes}:${parts[1]}`;
    }
    return duration;
  }

  // For numbers, show as "X min" if less than 1 minute, otherwise "X:XX"
  if (duration < 1) {
    return `${Math.round(duration * 60)} sec`;
  }
  
  const totalSeconds = Math.round(duration * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format duration for long display (e.g., "2 minutes 22 seconds" or "2:22")
 * 
 * @param duration - Duration as number (minutes) or string (MM:SS)
 * @returns Long formatted duration string
 */
export function formatDurationLong(duration: number | string): string {
  if (typeof duration === 'string') {
    return formatDuration(duration);
  }

  const totalSeconds = Math.round(duration * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

  return parts.join(' ') || '0 seconds';
}

