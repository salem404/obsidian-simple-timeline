export interface SimpleTimelineSettings {
	enableDateOnly: boolean; // 2024-12-31
	enableDateOnlyWithColon: boolean; // 2024-12-31:
	enableDateTime: boolean; // 2024-12-31 16:00
	enableDateTimeWithColon: boolean; // 2024-12-31 16:00:
	enableTimeOnly: boolean; // 16:00
	enableTimeOnlyWithColon: boolean; // 16:00:
}

export const DEFAULT_SETTINGS: SimpleTimelineSettings = {
	enableDateOnly: false,
	enableDateOnlyWithColon: true,
	enableDateTime: false,
	enableDateTimeWithColon: true,
	enableTimeOnly: true,
	enableTimeOnlyWithColon: true,
};