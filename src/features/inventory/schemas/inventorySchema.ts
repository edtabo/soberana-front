import { z } from 'zod';

export const inventorySchema = z.object({
  countId: z.string().min(1, "Debe seleccionar un conteo"),
  cutoffDate: z.string().min(1, "La fecha de corte es obligatoria"),
  warehouseId: z.string().min(1, "Debe seleccionar una bodega"),
  productId: z.string().min(1, "Debe seleccionar un producto"),
  quantityInPackaging: z.string().min(1, "La cantidad es obligatoria").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "La cantidad debe ser un número válido mayor o igual a 0"
  ),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

