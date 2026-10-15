// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { RHFDatePickerDayjs } from "@/shared/components/form/RHFDatePicker";

const DatePickerForm = ({
  value,
  yearOnly = false,
}: {
  value: string;
  yearOnly?: boolean;
}) => {
  const { control } = useForm<{ date: string }>({ defaultValues: { date: value } });
  return (
    <RHFDatePickerDayjs
      control={control}
      name="date"
      label="วันที่"
      format={yearOnly ? undefined : "D MMMM BBBB"}
      views={yearOnly ? ["year"] : undefined}
      openTo={yearOnly ? "year" : undefined}
      open={yearOnly}
    />
  );
};

describe("RHFDatePickerDayjs", () => {
  it("renders Gregorian form values with a Buddhist year", () => {
    const { container } = render(
      <DatePickerForm value="2026-10-08T08:00:00.000Z" />,
    );
    const visibleValue = [
      container.textContent,
      ...Array.from(container.querySelectorAll("input"), (input) => input.value),
    ].join(" ");

    expect(visibleValue).toContain("2569");
  });

  it("shows an error for an invalid value from partial date entry", async () => {
    render(<DatePickerForm value="Invalid Date" />);

    expect(await screen.findByText("รูปแบบวันที่ไม่ถูกต้อง")).toBeTruthy();
  });

  it("lists Buddhist years in the curriculum year picker", async () => {
    render(<DatePickerForm value="2026-10-08T08:00:00.000Z" yearOnly />);

    const picker = await screen.findByRole("dialog");
    expect(within(picker).getByText("2569")).toBeTruthy();
  });
});
