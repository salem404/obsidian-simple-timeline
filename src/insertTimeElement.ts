export function insertTimeElement(
	dateTime: string, 
	element: Text, 
	options?: {
		isTimeRange?: boolean,
		startTime?: string,
		endTime?: string,
		separator?: string,
		hasQuestionMark?: boolean
	}
) {
	const parent = element.parentElement;
	if (!parent) return;

	if (options?.isTimeRange && options.startTime && options.endTime) {
		// Create a div for time range
		const timeRangeDiv = parent.createEl("div", {
			prepend: true,
			cls: "ost-date"
		});

		// Extract just the time parts for display
		const startTimeMatch = options.startTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
		const endTimeMatch = options.endTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
		
		const startDisplayTime = startTimeMatch ? startTimeMatch[1] : options.startTime;
		const endDisplayTime = endTimeMatch ? endTimeMatch[1] : options.endTime;

		// Create start time element
		timeRangeDiv.createEl("time", {
			text: startDisplayTime,
			attr: {
				datetime: options.startTime,
			},
		});

		// Add separator
		timeRangeDiv.createSpan({
			text: options.separator || " - "
		});

		// Create end time element
		timeRangeDiv.createEl("time", {
			text: endDisplayTime,
			attr: {
				datetime: options.endTime,
			},
		});
	} else if (options?.hasQuestionMark) {
		// Create a div for question mark times
		const timeDiv = parent.createEl("div", {
			prepend: true,
			cls: "ost-date"
		});

		// Extract just the time part for display if it's a full datetime
		let displayText = dateTime;
		const dateTimeMatch = dateTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
		if (dateTimeMatch) {
			displayText = dateTimeMatch[1]; // Show only the time part
		}

		timeDiv.createEl("time", {
			text: displayText,
			attr: {
				datetime: dateTime,
			},
		});
	} else {
		// Standard behavior - just add time element
		// Extract just the time part for display if it's a full datetime
		let displayText = dateTime;
		const dateTimeMatch = dateTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
		if (dateTimeMatch) {
			displayText = dateTimeMatch[1]; // Show only the time part
		}
		
		parent.createEl("time", {
			prepend: true,
			text: displayText,
			cls: "ost-date",
			attr: {
				datetime: dateTime,
			},
		});
	}
}
