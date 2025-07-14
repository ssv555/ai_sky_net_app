import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useController } from 'react-hook-form';

export const FormTextField = ({ name, control, label, ...props }) => {
  const { field, fieldState: { error } } = useController({
    name,
    control
  });
  
  return (
    <TextField
      {...field}
      {...props}
      label={label}
      error={!!error}
      helperText={error?.message}
      fullWidth
    />
  );
};

export const FormSelect = ({ name, control, label, options, ...props }) => {
  const { field, fieldState: { error } } = useController({
    name,
    control
  });

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} {...props} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};