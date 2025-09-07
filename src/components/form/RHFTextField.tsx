// RHFInput.tsx
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";

type RHFInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  requiredMark?: boolean;
} & Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "error" | "helperText" | "label"
>;

export function RHFTextField<T extends FieldValues>({
  name,
  control,
  label,
  requiredMark,
  ...props
}: RHFInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack spacing={0.5}>
          {label && (
            <FormLabel>
              {requiredMark && label ? `${label} *` : label}
            </FormLabel>
          )}
          <TextField
            {...props}
            {...field}
            value={field.value ?? ""}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            variant="outlined"
            fullWidth
          />
        </Stack>
      )}
    />
  );
}
