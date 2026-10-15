import { useState } from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  DatePicker,
  LocalizationProvider,
  DatePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjsBuddhist } from "@/shared/lib/adapter-dayjs-buddhist";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";

type RHFDatePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  adapterLocale?: string;
  requiredMark?: boolean;
  required?: boolean;
} & Omit<DatePickerProps, "value" | "onChange" | "label">;

export function RHFDatePickerDayjs<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  adapterLocale = "th",
  requiredMark,
  required,
  ...props
}: RHFDatePickerProps<T>) {
  const [pickerError, setPickerError] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && (
            <FormLabel>
              {label}
              {(requiredMark || required) && <span className="text-accent04 ml-1">*</span>}
            </FormLabel>
          )}

          <LocalizationProvider
            dateAdapter={AdapterDayjsBuddhist}
            adapterLocale={adapterLocale}
          >
            <DatePicker
              {...props}
              value={field.value ? dayjs(field.value) : null}
              onError={(error) => setPickerError(error !== null)}
              onChange={(val) =>
                field.onChange(
                  val === null
                    ? ""
                    : val.isValid()
                      ? val.toISOString()
                      : "Invalid Date",
                )
              }
              slotProps={{
                textField: {
                  required: required,
                  placeholder,
                  fullWidth: true,
                  variant: "outlined",
                  error: !!fieldState.error || pickerError,
                  helperText:
                    fieldState.error?.message ||
                    (pickerError ? "รูปแบบวันที่ไม่ถูกต้อง" : undefined),
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      )}
    />
  );
}
