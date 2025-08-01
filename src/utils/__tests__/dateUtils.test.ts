import { describe, expect, it } from "vitest";
import {
    addMonths,
    formatDate,
    getDateRange,
    getYear,
    isDateInYear,
} from "../dateUtils";

describe("dateUtils", () => {
    it("addMonths should correctly add months to date", () => {
        const date = new Date(2024, 0, 31);
        const result = addMonths(date, 1);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(2);
    });

    it("formatDate should return capitalized ru-RU month and year", () => {
        const date = new Date(2024, 5, 15);
        const formatted = formatDate(date);
        expect(formatted).toMatch(/Июнь 2024/);
    });

    it("getYear returns full year", () => {
        const date = new Date(1999, 11, 1);
        expect(getYear(date)).toBe(1999);
    });

    it("isDateInYear returns true if date belongs to year", () => {
        const date = new Date(2025, 3, 10);
        expect(isDateInYear(date, 2025)).toBe(true);
        expect(isDateInYear(date, 2024)).toBe(false);
    });

    it("getDateRange returns min and max year from dates", () => {
        const dates = [
            new Date(2020, 0, 1),
            new Date(2022, 0, 1),
            new Date(2021, 0, 1),
        ];
        const { minYear, maxYear } = getDateRange(dates);
        expect(minYear).toBe(2020);
        expect(maxYear).toBe(2022);
    });

    it("getDateRange returns current year if array empty", () => {
        const { minYear, maxYear } = getDateRange([]);
        const currentYear = new Date().getFullYear();
        expect(minYear).toBe(currentYear);
        expect(maxYear).toBe(currentYear);
    });
});
