import { describe, expect, it } from "vitest";
import { hasDateTimeTimeComponent } from "./insertTimeElement";

describe('hasTimeComponent', () => {
	it('returns true for date time values like 2026-06-05 17:27', () => {
		expect(hasDateTimeTimeComponent('2026-06-05 17:27')).toBe(true);
	});

	it('returns false for date only values', () => {
		expect(hasDateTimeTimeComponent('2026-06-05')).toBe(false);
	});
});