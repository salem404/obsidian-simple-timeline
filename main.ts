import { Plugin } from 'obsidian';
import { extractDateTime } from 'src/extractDateTime';
import { insertTimeElement } from 'src/insertTimeElement';
import { SimpleTimelineSettings, DEFAULT_SETTINGS } from 'src/settings';
import { SimpleTimelineSettingTab } from 'src/settingsTab';


export default class SimpleTimelinePlugin extends Plugin {
	settings: SimpleTimelineSettings;
	async onload() {
		await this.loadSettings();

		// Add the settings tab
		this.addSettingTab(new SimpleTimelineSettingTab(this.app, this));

		this.registerMarkdownPostProcessor((el, ctx) => {
			// Process list items
			el.findAll('li:not(li ul li)').forEach((listItem) => {
				let previousElDateTime: string | null = null;
				
				// Process direct text nodes in the list item
				listItem.childNodes.forEach((child) => {
					if (child instanceof Text) {
						const result = this.processTextNode(child, ctx.sourcePath, previousElDateTime);
						if (result) {
							previousElDateTime = result;
						} else {
							previousElDateTime = null;
						}
					}
				});

				// Also process text nodes within p elements (Obsidian sometimes wraps content in p tags)
				listItem.findAll('p').forEach((pElement) => {
					pElement.childNodes.forEach((child) => {
						if (child instanceof Text) {
							const result = this.processTextNode(child, ctx.sourcePath, previousElDateTime);
							if (result) {
								previousElDateTime = result;
							} else {
								previousElDateTime = null;
							}
						}
					});
				});
			});
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private processTextNode(child: Text, sourcePath: string, previousElDateTime: string | null): string | null {
		const match = extractDateTime(child.textContent || '', this.settings, sourcePath);
		if (match.dateTime) {
			const { 
				modifiedText, 
				dateTime, 
				isTimeRange, 
				isDateTimeRange,
				startTime, 
				endTime, 
				separator, 
				hasQuestionMark,
				questionMarkPosition,
				isApproximate,
				approximatePrefix
			} = match;
			child.textContent = modifiedText

			if (previousElDateTime !== dateTime) {
				insertTimeElement(dateTime, child, {
					isTimeRange,
					isDateTimeRange,
					startTime,
					endTime,
					separator,
					hasQuestionMark,
					questionMarkPosition,
					isApproximate,
					approximatePrefix
				});
			}

			return dateTime;
		}
		return null;
	}
}
