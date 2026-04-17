import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  SelectProps,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";

type RHFSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string; // แสดงหัวข้อด้านบน
  requiredMark?: boolean;
} & Omit<SelectProps, "name" | "value" | "onChange">;

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  children,
  ...props
}: RHFSelectProps<T>) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && (
            <FormLabel
              focused={focused}
              error={!!fieldState.error}
            >{requiredMark ? `${label} *` : label}</FormLabel>
          )}

          <FormControl fullWidth error={!!fieldState.error}>
            <Select
              {...props}
              {...field}
              value={field.value ?? ""}
              size={props.size ?? "small"}
              onChange={(e) => field.onChange(e.target.value)}
              onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              field.onBlur();
              props.onBlur?.(e);
            }}
            >
              {children}
            </Select>

            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        </Stack>
      )}
    />
  );
}
