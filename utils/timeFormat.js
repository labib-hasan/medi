// Utility function for consistent 12-hour time formatting across the application
export const formatTimeToAMPM = (timeString) => {
  if (!timeString) return '';

  // Helper to convert any hour to 12-hour format
  const to12Hour = (hour, period) => {
    let h = parseInt(hour);
    // If period provided, use it as-is
    if (period) {
      const isPM = period.toLowerCase() === 'pm';
      const isAM = period.toLowerCase() === 'am';
      if (isPM && h !== 12) return { hour: h, period: 'PM' };
      if (isPM && h === 12) return { hour: 12, period: 'PM' };
      if (isAM && h === 12) return { hour: 12, period: 'AM' };
      return { hour: h, period: 'AM' };
    }
    // Convert 24-hour format to 12-hour
    if (h === 0 || h === 24) return { hour: 12, period: 'AM' };
    if (h === 12) return { hour: 12, period: 'PM' };
    if (h > 12) return { hour: h - 12, period: 'PM' };
    return { hour: h, period: 'AM' };
  };

  const formatTime = (h, m, p) => {
    let min = m || '00';
    if (min.length === 1) min = '0' + min;
    const time12 = to12Hour(h, p);
    return `${time12.hour}:${min} ${time12.period}`;
  };

  // First, check if it's a time range (contains "to" or "-")
  const rangeMatch = timeString.match(/(\d+)(?:\.(\d+))?\s*(am|pm|AM|PM)?\s*(?:to|-)\s*(\d+)(?:\.(\d+))?\s*(am|pm|AM|PM)?/i);
  if (rangeMatch) {
    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = rangeMatch;
    const start = formatTime(startHour, startMin, startPeriod);
    const end = formatTime(endHour, endMin, endPeriod);
    return `${start} - ${end}`;
  }

  // Single time
  const singleMatch = timeString.match(/(\d+)(?:\.(\d+))?\s*(am|pm|AM|PM)?/i);
  if (singleMatch) {
    const [, hour, minute, period] = singleMatch;
    return formatTime(hour, minute, period);
  }

  return timeString;
};

// Helper function to format time for display in admin panel
export const formatTimeForDisplay = (timeString) => {
  if (!timeString) return 'Not set';

  // If it's already in a readable format, return as is
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }

  // If it's in 24-hour format like "09:00 - 17:00", convert to 12-hour
  const rangeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (rangeMatch) {
    const [, startHour, startMin, endHour, endMin] = rangeMatch;
    const start = formatTimeToAMPM(`${startHour}:${startMin}`);
    const end = formatTimeToAMPM(`${endHour}:${endMin}`);
    return `${start} - ${end}`;
  }

  return formatTimeToAMPM(timeString);
};
