import { z } from 'zod';

export const inventorySchema = z.object({
  warehouseId: z.string().min(1, "Debe seleccionar una bodega"),
  cutoffDate: z.string().min(1, "La fecha de corte es obligatoria"),
  products: z.array(z.object({
    productId: z.number().min(1, "ID de producto inválido"),
    quantityInPackaging: z.number().min(0, "La cantidad debe ser mayor o igual a 0"),
    quantityInUnits: z.number().min(0, "La cantidad debe ser mayor o igual a 0")
  })).min(1, "Debe ingresar al menos un producto")
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

