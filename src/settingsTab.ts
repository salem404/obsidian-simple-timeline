import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleTimelinePlugin from '../main';
import { SimpleTimelineSettings } from './settings';

export class SimpleTimelineSettingTab extends PluginSettingTab {
	plugin: SimpleTimelinePlugin;

	constructor(app: App, plugin: SimpleTimelinePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Simple Timeline Settings' });

		containerEl.createEl('p', { 
			text: 'Choose which datetime formats to recognize for timeline entries. All formats support question marks (?), approximate times (~), and ranges where applicable.' 
		});

		// Date formats section
		containerEl.createEl('h3', { text: 'Date Formats' });

		new Setting(containerEl)
			.setName('Date only (2024-12-31)')
			.setDesc('Recognize dates without time or colon. Also supports: 2024-12-31?, ~ 2024-12-31')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateOnly)
				.onChange(async (value) => {
					this.plugin.settings.enableDateOnly = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date with colon (2024-12-31:)')
			.setDesc('Recognize dates with colon but no time. Also supports: 2024-12-31?')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateOnlyWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableDateOnlyWithColon = value;
					await this.plugin.saveSettings();
				}));

		// DateTime formats section
		containerEl.createEl('h3', { text: 'Date and Time Formats' });

		new Setting(containerEl)
			.setName('Date and time (2024-12-31 16:00)')
			.setDesc('Recognize dates with time but no colon. Also supports: ~ 2024-12-31 16:00, datetime ranges')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateTime)
				.onChange(async (value) => {
					this.plugin.settings.enableDateTime = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date and time with colon (2024-12-31 16:00:)')
			.setDesc('Recognize dates with time and colon. Also supports: 2024-12-31 16:00?, datetime ranges, range question marks')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateTimeWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableDateTimeWithColon = value;
					await this.plugin.saveSettings();
				}));

		// Time-only formats section
		containerEl.createEl('h3', { text: 'Time-Only Formats' });
		containerEl.createEl('p', { 
			text: 'Time-only formats require the file name to contain a date (e.g., 2024-12-31-notes.md). Single-digit hours are supported (e.g., 5:09, 0:17).',
			attr: { style: 'color: var(--text-muted); font-size: 0.9em; margin-bottom: 1em;' }
		});

		new Setting(containerEl)
			.setName('Time only (16:00)')
			.setDesc('Recognize time only. Also supports: ~ 16:00, time ranges (16:00 - 17:30)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableTimeOnly)
				.onChange(async (value) => {
					this.plugin.settings.enableTimeOnly = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Time with colon/question mark (16:00: or 16:00?)')
			.setDesc('Recognize time with colon or question mark. Also supports: time ranges with question marks')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableTimeOnlyWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableTimeOnlyWithColon = value;
					await this.plugin.saveSettings();
				}));

		// Additional features section
		containerEl.createEl('h3', { text: 'Automatic Features' });
		containerEl.createEl('p', { 
			text: 'The following features are automatically available when the relevant base formats are enabled:',
			attr: { style: 'margin-bottom: 0.5em;' }
		});
		
		const featureList = containerEl.createEl('ul', { 
			attr: { style: 'color: var(--text-muted); font-size: 0.9em; margin-left: 1em;' }
		});
		featureList.createEl('li', { text: 'Question mark support (?) - shows uncertainty' });
		featureList.createEl('li', { text: 'Approximate times (~) - shows "around" that time' });
		featureList.createEl('li', { text: 'Time ranges (HH:MM - HH:MM) - spans of time' });
		featureList.createEl('li', { text: 'DateTime ranges (full date ranges)' });
		featureList.createEl('li', { text: 'Single-digit hours (5:09 instead of 05:09)' });
	}
}