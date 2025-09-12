import { describe, expect, it } from "vitest";
import { extractDateTime } from "./extractDateTime";
import { SimpleTimelineSettings } from "./settings";

// Default test settings matching the old behavior
const defaultTestSettings: SimpleTimelineSettings = {
  enableDateOnly: false,
  enableDateOnlyWithColon: true,
  enableDateTime: false,
  enableDateTimeWithColon: true,
  enableTimeOnly: false,
  enableTimeOnlyWithColon: false,
};

describe('extractDateTime', () => {
  describe('When the given text starts with a valid date and a colon', () => {
    it('Should remove the date from the string and return both the modified string and the date', () => {
      const { modifiedText, dateTime } = extractDateTime('2021-08-13: This is a test', defaultTestSettings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2021-08-13');
    });
  });

  describe('When the given text starts with a valid date but no colon', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('2025-03-21 This is a test', defaultTestSettings);
      expect(modifiedText).toBe('2025-03-21 This is a test');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text does not start with a valid date', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test', defaultTestSettings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text contains a valid date, but not at the start of the string', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test: 2025-03-21: hello world', defaultTestSettings);
      expect(modifiedText).toBe('This is a test: 2025-03-21: hello world');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text contains a valid date, but at the end of the string', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test: 2025-03-21:', defaultTestSettings);
      expect(modifiedText).toBe('This is a test: 2025-03-21:');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text starts with a valid date and time and a colon', () => {
    it('Should remove the date from the string and return both the modified string and the date', () => {
      const { modifiedText, dateTime } = extractDateTime('2021-08-13 13:23: This is a test', defaultTestSettings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2021-08-13 13:23');
    });
  });

  describe('When the given text starts with a valid date and time but no colon', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('2025-03-21 13:23 This is a test', defaultTestSettings);
      expect(modifiedText).toBe('2025-03-21 13:23 This is a test');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text does not start with a valid date and time', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test', defaultTestSettings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text contains a valid date and time, but not at the start of the string', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test: 2025-03-21 13:23: hello world', defaultTestSettings);
      expect(modifiedText).toBe('This is a test: 2025-03-21 13:23: hello world');
      expect(dateTime).toBe(null);
    });
  });

  describe('When the given text contains a valid date and time, but at the end of the string', () => {
    it('Should return the original string and null', () => {
      const { modifiedText, dateTime } = extractDateTime('This is a test: 2025-03-21 13:23:', defaultTestSettings);
      expect(modifiedText).toBe('This is a test: 2025-03-21 13:23:');
      expect(dateTime).toBe(null);
    });
  });

  // New tests for additional formats
  describe('When enableDateOnly is true and text starts with date only', () => {
    const settings: SimpleTimelineSettings = { ...defaultTestSettings, enableDateOnly: true };
    
    it('Should extract date without colon', () => {
      const { modifiedText, dateTime } = extractDateTime('2024-12-31 This is a test', settings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31');
    });
  });

  describe('When enableDateTime is true and text starts with date and time', () => {
    const settings: SimpleTimelineSettings = { ...defaultTestSettings, enableDateTime: true };
    
    it('Should extract date and time without colon', () => {
      const { modifiedText, dateTime } = extractDateTime('2024-12-31 16:00 This is a test', settings);
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31 16:00');
    });
  });

  describe('When enableTimeOnly is true and file has date in name', () => {
    const settings: SimpleTimelineSettings = { ...defaultTestSettings, enableTimeOnly: true };
    
    it('Should extract time and combine with file date', () => {
      const { modifiedText, dateTime } = extractDateTime('16:00 This is a test', settings, '/path/to/2024-12-31-notes.md');
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31 16:00');
    });

    it('Should handle single digit hours', () => {
      const { modifiedText, dateTime } = extractDateTime('5:09 This is a test', settings, '/path/to/2024-12-31-notes.md');
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31 5:09');
    });

    it('Should handle time ranges', () => {
      const result = extractDateTime('17:00 - 20:30 This is a meeting', settings, '/path/to/2024-12-31-notes.md');
      expect(result.modifiedText).toBe('This is a meeting');
      expect(result.dateTime).toBe('2024-12-31 17:00');
      expect(result.isTimeRange).toBe(true);
      expect(result.startTime).toBe('2024-12-31 17:00');
      expect(result.endTime).toBe('2024-12-31 20:30');
      expect(result.separator).toBe(' - ');
    });

    it('Should handle time ranges with different spacing', () => {
      const result = extractDateTime('9:00-17:00 Work day', settings, '/path/to/2024-12-31-notes.md');
      expect(result.modifiedText).toBe('Work day');
      expect(result.isTimeRange).toBe(true);
      expect(result.startTime).toBe('2024-12-31 9:00');
      expect(result.endTime).toBe('2024-12-31 17:00');
    });
  });

  describe('When enableTimeOnlyWithColon is true and file has date in name', () => {
    const settings: SimpleTimelineSettings = { ...defaultTestSettings, enableTimeOnlyWithColon: true };
    
    it('Should extract time with colon and combine with file date', () => {
      const { modifiedText, dateTime } = extractDateTime('16:00: This is a test', settings, '/path/to/2024-12-31-notes.md');
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31 16:00');
    });

    it('Should extract time with question mark and combine with file date', () => {
      const result = extractDateTime('16:00? This is a test', settings, '/path/to/2024-12-31-notes.md');
      expect(result.modifiedText).toBe('This is a test');
      expect(result.dateTime).toBe('2024-12-31 16:00');
      expect(result.hasQuestionMark).toBe(true);
    });

    it('Should handle single digit hours', () => {
      const { modifiedText, dateTime } = extractDateTime('0:17: This is a test', settings, '/path/to/2024-12-31-notes.md');
      expect(modifiedText).toBe('This is a test');
      expect(dateTime).toBe('2024-12-31 0:17');
    });

    it('Should detect question mark flag', () => {
      const result = extractDateTime('0:17? This might have happened', settings, '/path/to/2024-12-31-notes.md');
      expect(result.hasQuestionMark).toBe(true);
    });
  });

  describe('When time-only format is enabled but file has no date', () => {
    const settings: SimpleTimelineSettings = { ...defaultTestSettings, enableTimeOnly: true };
    
    it('Should return original text and null', () => {
      const { modifiedText, dateTime } = extractDateTime('16:00 This is a test', settings, '/path/to/notes.md');
      expect(modifiedText).toBe('16:00 This is a test');
      expect(dateTime).toBe(null);
    });
  });
});

