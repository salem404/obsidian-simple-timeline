import { SimpleTimelineSettings } from './settings';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?!\s\d{1,2}:\d{2})/; // Date only, not followed by time
const DATE_COLON_REGEX = /^\d{4}-\d{2}-\d{2}:/;
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}(?![:\?])/; // Date time without colon/question mark
const DATE_TIME_COLON_REGEX = /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}[:\?]/;
const TIME_REGEX = /^\d{1,2}:\d{2}(?![:\?\-])/; // Time only, not followed by colon, question mark, or dash
const TIME_COLON_REGEX = /^\d{1,2}:\d{2}[:\?]/; // Time with colon or question mark
const TIME_RANGE_REGEX = /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/; // Time range like "17:00 - 20:30"
const FILE_DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

function extractDateFromFilename(filePath: string): string | null {
	if (!filePath) return null;
	
	// Extract filename from path
	const filename = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
	
	// Look for date pattern in filename
	const match = filename.match(FILE_DATE_REGEX);
	return match ? match[0] : null;
}

export function extractDateTime(text: string, settings: SimpleTimelineSettings, filePath?: string): { 
	modifiedText: string, 
	dateTime: string | null, 
	isTimeRange?: boolean,
	startTime?: string,
	endTime?: string,
	separator?: string,
	hasQuestionMark?: boolean
} {
	// Check for time range first (most specific)
	const fileDate = extractDateFromFilename(filePath || '');
	
	if ((settings.enableTimeOnly || settings.enableTimeOnlyWithColon) && fileDate) {
		const rangeMatch = text.match(TIME_RANGE_REGEX);
		if (rangeMatch) {
			// Extract start time, separator, and end time
			const fullMatch = rangeMatch[0];
			const parts = fullMatch.split(/(\s*-\s*)/);
			const startTime = parts[0];
			const separator = parts[1];
			const endTime = parts[2];
			
			return {
				modifiedText: text.substring(fullMatch.length).trimStart(),
				dateTime: `${fileDate} ${startTime}`, // Primary datetime for the timeline
				isTimeRange: true,
				startTime: `${fileDate} ${startTime}`,
				endTime: `${fileDate} ${endTime}`,
				separator: separator
			};
		}
	}

	// Check each format based on settings, in order of specificity
	
	// First check datetime formats (most specific)
	if (settings.enableDateTimeWithColon) {
		const match = text.match(DATE_TIME_COLON_REGEX);
		if (match) {
			const hasQuestionMark = match[0].endsWith('?');
			return {
				modifiedText: text.replace(match[0], '').trimStart(),
				dateTime: match[0].replace(/[:\?]$/, ''),
				hasQuestionMark
			};
		}
	}

	if (settings.enableDateTime) {
		const match = text.match(DATE_TIME_REGEX);
		if (match) {
			return {
				modifiedText: text.substring(match[0].length).trimStart(),
				dateTime: match[0]
			};
		}
	}

	// Then check date with colon formats
	if (settings.enableDateOnlyWithColon) {
		const match = text.match(DATE_COLON_REGEX);
		if (match) {
			return {
				modifiedText: text.replace(match[0], '').trimStart(),
				dateTime: match[0].substring(0, match[0].length - 1)
			};
		}
	}

	// Then check date only format
	if (settings.enableDateOnly) {
		const match = text.match(DATE_REGEX);
		if (match) {
			return {
				modifiedText: text.substring(match[0].length).trimStart(),
				dateTime: match[0]
			};
		}
	}

	// Handle time-only formats (require file date)
	if (settings.enableTimeOnlyWithColon && fileDate) {
		const match = text.match(TIME_COLON_REGEX);
		if (match) {
			// Extract just the time part (remove the colon or question mark)
			const timeOnly = match[0].replace(/[:\?]$/, '');
			const hasQuestionMark = match[0].endsWith('?');
			return {
				modifiedText: text.replace(match[0], '').trimStart(),
				dateTime: `${fileDate} ${timeOnly}`,
				hasQuestionMark
			};
		}
	}

	if (settings.enableTimeOnly && fileDate) {
		const match = text.match(TIME_REGEX);
		if (match) {
			return {
				modifiedText: text.substring(match[0].length).trimStart(),
				dateTime: `${fileDate} ${match[0]}`
			};
		}
	}

	return { modifiedText: text, dateTime: null };
}
