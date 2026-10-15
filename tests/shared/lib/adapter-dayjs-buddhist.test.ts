import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { AdapterDayjsBuddhist } from "@/shared/lib/adapter-dayjs-buddhist";

describe("AdapterDayjsBuddhist", () => {
  const adapter = new AdapterDayjsBuddhist({ locale: "th" });

  it("formats Gregorian dates with Buddhist years and keeps Gregorian values", () => {
    const value = dayjs("2026-10-08T08:00:00.000Z");

    expect(adapter.formatByString(value, "D MMMM BBBB")).toBe("8 ตุลาคม 2569");
    expect(adapter.format(value, "year")).toBe("2569");
    expect(adapter.formats.keyboardDate).toBe("DD/MM/BBBB");
    expect(adapter.getYear(value)).toBe(2569);
    expect(value.toISOString()).toBe("2026-10-08T08:00:00.000Z");
  });

  it("parses Buddhist years before validating leap days", () => {
    const leapDay = adapter.parse("29/02/2567", "DD/MM/BBBB");
    const thaiMonthLeapDay = adapter.parse("29 กุมภาพันธ์ 2567", "D MMMM BBBB");
    const yearOnly = adapter.parse("2569", "BBBB");
    const invalidLeapDay = adapter.parse("29/02/2566", "DD/MM/BBBB");

    expect(leapDay?.isValid()).toBe(true);
    expect(leapDay?.format("YYYY-MM-DD")).toBe("2024-02-29");
    expect(dayjs(leapDay?.toISOString()).year()).toBe(2024);
    expect(thaiMonthLeapDay?.format("YYYY-MM-DD")).toBe("2024-02-29");
    expect(yearOnly?.year()).toBe(2026);
    expect(invalidLeapDay?.isValid()).toBe(false);
  });

  it("selects a Buddhist year while preserving the date and timezone", () => {
    const value = dayjs("2026-10-08T08:00:00.000Z");
    const selected = adapter.setYear(value, 2569);

    expect(selected.year()).toBe(2026);
    expect(selected.month()).toBe(value.month());
    expect(selected.date()).toBe(value.date());
    expect(selected.toISOString()).toBe(value.toISOString());
  });
});
