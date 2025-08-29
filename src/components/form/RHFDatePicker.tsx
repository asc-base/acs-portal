// RHFDatePickerDayjs.tsx
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  DatePicker,
  LocalizationProvider,
  DatePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";

type RHFDatePickerProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  adapterLocale?: string;
} & Omit<DatePickerProps, "value" | "onChange" | "label">;

export function RHFDatePickerDayjs<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  adapterLocale = "th",
  ...props
}: RHFDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && <FormLabel>{label}</FormLabel>}

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={adapterLocale}
          >
            <DatePicker
              {...props}
              value={(field.value as Dayjs | null) ?? null}
              onChange={(val) => field.onChange(val)} // RHF เก็บเป็น Dayjs | null
              slotProps={{
                textField: {
                  placeholder,
                  fullWidth: true,
                  variant: "outlined",
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      )}
    />
  );
}
