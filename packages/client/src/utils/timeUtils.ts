/**
 * Formats a UTC timestamp to a local time string with date if not today
 * @param timestamp - UTC timestamp in milliseconds (from server)
 * @returns Formatted time string with date if different day, or just time if today
 */
export const formatTime = (timestamp: number): string => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  
  // Check if message is from today
  const isToday = messageDate.toDateString() === today.toDateString();
  
  // Check if message is from current year
  const isCurrentYear = messageDate.getFullYear() === today.getFullYear();
  
  if (isToday) {
    // Just show time for today's messages
    return messageDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else if (isCurrentYear) {
    // Show date and time for messages from this year (no year needed)
    return messageDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } else {
    // Show date, year and time for messages from other years
    return messageDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
};