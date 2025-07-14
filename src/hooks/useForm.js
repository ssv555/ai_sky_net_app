import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export const useAppForm = (schema, defaultValues = {}) => {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange'
  });
};