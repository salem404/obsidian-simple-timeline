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
			let previousElDateTime: string | null = null;

			el.findAll('li:not(li ul li)').forEach((el) => {
				el.childNodes.forEach((child) => {
					if (child instanceof Text) {
						const match = extractDateTime(child.textContent || '', this.settings, ctx.sourcePath);
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

							previousElDateTime = dateTime;
						} else {
							previousElDateTime = null;
						}
					}
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
}
