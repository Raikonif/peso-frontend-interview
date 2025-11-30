import z from "zod";
import { PRODUCT_CATEGORIES } from "@/lib/types/product";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(99999, "El precio no puede exceder 99,999"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  category: z.enum(PRODUCT_CATEGORIES, {
    message: "Selecciona una categoría válida",
  }),
  image: z.url({ message: "Ingresa una URL válida para la imagen" }),
});
