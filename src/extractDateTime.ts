import { SimpleTimelineSettings } from './settings';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(?!\s\d{2}:\d{2})/; // Date only, not followed by time
const DATE_COLON_REGEX = /^\d{4}-\d{2}-\d{2}:/;
const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?!:)/; // Date time without colon
const DATE_TIME_COLON_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:/;
const TIME_REGEX = /^\d{2}:\d{2}(?!:)/; // Time only, not followed by colon
const TIME_COLON_REGEX = /^\d{2}:\d{2}:/;
const FILE_DATE_REGEX = /\d{4}-\d{2}-\d{2}/;

function extractDateFromFilename(filePath: string): string | null {
	if (!filePath) return null;
	
	// Extract filename from path
	const filename = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
	
	// Look for date pattern in filename
	const match = filename.match(FILE_DATE_REGEX);
	return match ? match[0] : null;
}

export function extractDateTime(text: string, settings: SimpleTimelineSettings, filePath?: string): { modifiedText: string, dateTime: string | null } {
	// Check each format based on settings, in order of specificity
	
	// First check datetime formats (most specific)
	if (settings.enableDateTimeWithColon) {
		const match = text.match(DATE_TIME_COLON_REGEX);
		if (match) {
			return {
				modifiedText: text.replace(match[0], '').trimStart(),
				dateTime: match[0].substring(0, match[0].length - 1)
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
	const fileDate = extractDateFromFilename(filePath || '');
	
	if (settings.enableTimeOnlyWithColon && fileDate) {
		const match = text.match(TIME_COLON_REGEX);
		if (match) {
			return {
				modifiedText: text.replace(match[0], '').trimStart(),
				dateTime: `${fileDate} ${match[0].substring(0, match[0].length - 1)}`
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
