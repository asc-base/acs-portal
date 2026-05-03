import { ReactNode, useState } from "react";
import { Controller, FieldValues, Path, Control } from "react-hook-form";
import {
  TextField,
  Stack,
  FormLabel,
  InputAdornment,
  TextFieldProps,
} from "@mui/material";

interface RHFInputProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name" | "slotProps"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  requiredMark?: boolean;
  startIcon?: ReactNode; // เพิ่ม optional startIcon
  endIcon?: ReactNode; // เพิ่ม optional endIcon
  slotProps?: TextFieldProps["slotProps"];
}
export function RHFTextField<T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  startIcon,
  endIcon,
  slotProps,
  ...props
}: Readonly<RHFInputProps<T>>) {
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
            >
              {requiredMark ? `${label} *` : label}
            </FormLabel>
          )}

          <TextField
            {...props}
            {...field}
            value={field.value ?? ""}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            variant="outlined"
            size={props.size ?? "small"}
            fullWidth
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              field.onBlur();
              props.onBlur?.(e);
            }}
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps?.input,
                ...(startIcon && {
                  startAdornment: (
                    <InputAdornment position="start">
                      {startIcon}
                    </InputAdornment>
                  ),
                }),
                ...(endIcon && {
                  endAdornment: (
                    <InputAdornment position="end">{endIcon}</InputAdornment>
                  ),
                }),
              },
            }}
          />
        </Stack>
      )}
    />
  );
}