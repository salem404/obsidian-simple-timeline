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
			text: 'Choose which datetime formats to recognize for timeline entries:' 
		});

		new Setting(containerEl)
			.setName('Date only (2024-12-31)')
			.setDesc('Recognize dates without time or colon')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateOnly)
				.onChange(async (value) => {
					this.plugin.settings.enableDateOnly = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date with colon (2024-12-31:)')
			.setDesc('Recognize dates with colon but no time')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateOnlyWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableDateOnlyWithColon = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date and time (2024-12-31 16:00)')
			.setDesc('Recognize dates with time but no colon')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateTime)
				.onChange(async (value) => {
					this.plugin.settings.enableDateTime = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Date and time with colon (2024-12-31 16:00:)')
			.setDesc('Recognize dates with time and colon')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableDateTimeWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableDateTimeWithColon = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Time only (16:00)')
			.setDesc('Recognize time only (requires file name to be in date format)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableTimeOnly)
				.onChange(async (value) => {
					this.plugin.settings.enableTimeOnly = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Time only with colon (16:00:)')
			.setDesc('Recognize time with colon (requires file name to be in date format)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableTimeOnlyWithColon)
				.onChange(async (value) => {
					this.plugin.settings.enableTimeOnlyWithColon = value;
					await this.plugin.saveSettings();
				}));
	}
}