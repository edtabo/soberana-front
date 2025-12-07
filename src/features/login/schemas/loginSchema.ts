import { z } from 'zod';
import { localizations } from '@/utils/localizations';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: localizations.validation.emailRequired })
    .email({ message: localizations.validation.emailInvalid }),
  password: z
    .string()
    .min(1, { message: localizations.validation.passwordRequired })
    .min(6, { message: localizations.validation.passwordMinLength }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
