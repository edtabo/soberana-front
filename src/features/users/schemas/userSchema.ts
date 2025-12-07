import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  roleId: z.string().min(1, "Debe seleccionar un rol"),
  warehouses: z.array(z.string()).min(1, "Debe seleccionar al menos una bodega"),
});

export type UserFormData = z.infer<typeof userSchema>;
