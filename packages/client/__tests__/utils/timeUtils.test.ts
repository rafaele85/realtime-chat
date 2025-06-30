import { formatTime } from '../../src/utils/timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    it('should format UTC timestamp to local time string with date and year for past years', () => {
      // Create a specific UTC timestamp: 2021-01-01 12:00:00 UTC (past year)
      const utcTimestamp = new Date('2021-01-01T12:00:00.000Z').getTime();
      
      const result = formatTime(utcTimestamp);
      
      // Should include date and year for past years
      expect(result).toMatch(/\w{3} \d{1,2}, \d{4}, \d{2}:\d{2}:\d{2}/); // "Jan 1, 2021, 12:00:00"
      expect(typeof result).toBe('string');
    });

    it('should convert server timestamps to user local timezone with date and year for past years', () => {
      // Use a known UTC timestamp from the past year
      const utcTimestamp = new Date('2021-01-01T15:30:45.000Z').getTime();
      
      const result = formatTime(utcTimestamp);
      
      // Should include date, year and time for past years
      expect(result).toMatch(/\w{3} \d{1,2}, \d{4}, \d{2}:\d{2}:\d{2}/);
      
      // The exact time will depend on the test environment's timezone,
      // but it should not be the raw timestamp
      expect(result).not.toBe(utcTimestamp.toString());
    });

    it('should handle current timestamps correctly', () => {
      const now = Date.now();
      
      const result = formatTime(now);
      
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(typeof result).toBe('string');
    });

    it('should include date when message is from a different day', () => {
      // Create timestamp from yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(14, 30, 0, 0);
      
      const result = formatTime(yesterday.getTime());
      
      // Should include date information with month name format
      expect(result).toMatch(/\w{3} \d{1,2}, \d{2}:\d{2}:\d{2}/); // "Jun 29, 14:30:00"
      expect(result.length).toBeGreaterThan(8); // More than just "HH:MM:SS"
    });

    it('should show different formats for today vs other days', () => {
      const now = Date.now();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayResult = formatTime(now);
      const yesterdayResult = formatTime(yesterday.getTime());
      
      // Today should be shorter (just time)
      // Other days should be longer (date + time)
      expect(yesterdayResult.length).toBeGreaterThan(todayResult.length);
    });

    it('should include year for messages from different years', () => {
      // Create timestamp from last year
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      lastYear.setHours(14, 30, 0, 0);
      
      const result = formatTime(lastYear.getTime());
      
      // Should include year for messages from different years
      // Format should be like "Jun 30, 2023, 14:30:00"
      expect(result).toMatch(/\w{3} \d{1,2}, \d{4}, \d{2}:\d{2}:\d{2}/);
      expect(result).toContain((lastYear.getFullYear()).toString()); // Should contain the correct year
    });
  });
});