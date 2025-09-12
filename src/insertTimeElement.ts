export function insertTimeElement(
	dateTime: string, 
	element: Text, 
	options?: {
		isTimeRange?: boolean,
		isDateTimeRange?: boolean,
		startTime?: string,
		endTime?: string,
		separator?: string,
		hasQuestionMark?: boolean,
		questionMarkPosition?: 'end' | 'both' | 'start',
		isApproximate?: boolean,
		approximatePrefix?: string,
		pElement?: HTMLElement
	}
) {
	const parent = element.parentElement;
	if (!parent) return;

	// If we have a pElement, we're inside a <p> tag - add the class to the p element and create time inside
	if (options?.pElement) {
		options.pElement.addClass('ost-date');
		
		// Clear the text content and create a time element inside the p
		element.textContent = '';
		
		if (options.isDateTimeRange && options.startTime && options.endTime) {
			// Create start datetime element
			options.pElement.createEl("time", {
				text: options.startTime,
				attr: {
					datetime: options.startTime,
				},
			});

			// Add separator
			options.pElement.createSpan({
				text: options.separator || " - "
			});

			// Create end datetime element
			options.pElement.createEl("time", {
				text: options.endTime,
				attr: {
					datetime: options.endTime,
				},
			});

			// Add question mark if present
			if (options.hasQuestionMark) {
				options.pElement.createSpan({
					text: "?"
				});
			}
		} else if (options.isTimeRange && options.startTime && options.endTime) {
			// Extract just the time parts for display
			const startTimeMatch = options.startTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
			const endTimeMatch = options.endTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
			
			const startDisplayTime = startTimeMatch ? startTimeMatch[1] : options.startTime;
			const endDisplayTime = endTimeMatch ? endTimeMatch[1] : options.endTime;

			// Create start time element
			options.pElement.createEl("time", {
				text: startDisplayTime,
				attr: {
					datetime: options.startTime,
				},
			});

			// Add separator
			options.pElement.createSpan({
				text: options.separator || " - "
			});

			// Create end time element
			options.pElement.createEl("time", {
				text: endDisplayTime,
				attr: {
					datetime: options.endTime,
				},
			});

			// Add question mark if present
			if (options.hasQuestionMark) {
				options.pElement.createSpan({
					text: "?"
				});
			}
		} else if (options.isApproximate) {
			// Add the ~ prefix
			options.pElement.createSpan({
				text: options.approximatePrefix || "~ "
			});

			// Extract just the time part for display if it's a full datetime
			let displayText = dateTime;
			const dateTimeMatch = dateTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
			if (dateTimeMatch) {
				displayText = dateTimeMatch[1]; // Show only the time part
			}

			options.pElement.createEl("time", {
				text: displayText,
				attr: {
					datetime: dateTime,
				},
			});
		} else if (options.hasQuestionMark) {
			// Extract just the time part for display if it's a full datetime
			let displayText = dateTime;
			const dateTimeMatch = dateTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
			if (dateTimeMatch) {
				displayText = dateTimeMatch[1]; // Show only the time part
			}

			options.pElement.createEl("time", {
				text: displayText,
				attr: {
					datetime: dateTime,
				},
			});

			// Add question mark as a span
			options.pElement.createSpan({
				text: "?"
			});
		} else {
			// Standard behavior - create time element inside p
			// Extract just the time part for display if it's a full datetime
			let displayText = dateTime;
			const dateTimeMatch = dateTime.match(/^\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2})$/);
			if (dateTimeMatch) {
				displayText = dateTimeMatch[1]; // Show only the time part
			}
			
			options.pElement.createEl("time", {
				text: displayText,
				attr: {
					datetime: dateTime,
				},
			});
		}
		
		return; // Don't create additional elements when styling the p element
	}

	if (options?.isDateTimeRange && options.startTime && options.endTime) {
		// Create a div for datetime range
		const timeRangeDiv = parent.createEl("div", {
			prepend: true,
			cls: "ost-date"
		});

		// Create start datetime element
		timeRangeDiv.createEl("time", {
			text: options.startTime,
			attr: {
				datetime: options.startTime,
			},
		});

		// Add separator
		timeRangeDiv.createSpan({
			text: options.separator || " - "
		});

		// Create end datetime element
		timeRangeDiv.createEl("time", {
			text: options.endTime,
			attr: {
				datetime: options.endTime,
			},
		});

		// Add question mark if present
		if (options.hasQuestionMark) {
			timeRangeDiv.createSpan({
				text: "?"
			});
		}
	} else if (options?.isTimeRange && options.startTime && options.endTime) {
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

		// Add question mark if present
		if (options.hasQuestionMark) {
			timeRangeDiv.createSpan({
				text: "?"
			});
		}
	} else if (options?.isApproximate) {
		// Create a div for approximate times
		const timeDiv = parent.createEl("div", {
			prepend: true,
			cls: "ost-date"
		});

		// Add the ~ prefix
		timeDiv.createSpan({
			text: options.approximatePrefix || "~ "
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

		// Add question mark as a span
		timeDiv.createSpan({
			text: "?"
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
