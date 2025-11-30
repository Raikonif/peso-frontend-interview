"use client";

import { useState } from "react";
import { useForm } from "@/lib/hooks/useForm";
import { CreateProductDTO, PRODUCT_CATEGORIES } from "@/lib/types/product";
import { useCreateProduct } from "@/lib/hooks/useProducts";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { z } from "zod";

// Validation schema using Zod
const productSchema = z.object({
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
  image: z
    .string()
    .url("Ingresa una URL válida para la imagen")
    .min(1, "La imagen es requerida"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValues, string>>
  >({});

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } =
    useForm<ProductFormValues>({
      initialValues: {
        title: "",
        price: 0,
        description: "",
        category: "" as ProductFormValues["category"],
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      },
      onSubmit: async (formValues: ProductFormValues) => {
        // Validate form
        const result = productSchema.safeParse(formValues);

        if (!result.success) {
          const fieldErrors: Partial<Record<keyof ProductFormValues, string>> =
            {};
          result.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof ProductFormValues;
            fieldErrors[field] = issue.message;
          });
          setErrors(fieldErrors);
          return;
        }

        setErrors({});

        // Submit to API
        const productData: CreateProductDTO = {
          title: formValues.title,
          price: formValues.price,
          description: formValues.description,
          category: formValues.category,
          image: formValues.image,
        };

        await createProduct.mutateAsync(productData);
        resetForm();
        onSuccess?.();
      },
    });

  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-2 overflow-hidden max-h-10/12"
    >
      <Input
        label="Título del producto"
        name="title"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Ej: Camiseta de algodón premium"
        className="text-sm placeholder:text-sm"
        required
      />
      <div className="flex space-x-2">
        <Input
          label="Precio (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={values.price || ""}
          onChange={handleChange}
          error={errors.price}
          placeholder="Ej: 29.99"
          className="text-sm placeholder:text-sm"
          required
        />
        <Select
          label="Categoría"
          name="category"
          value={values.category}
          onChange={handleChange}
          error={errors.category}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          className="text-sm placeholder:text-sm"
          required
        />
      </div>

      <Textarea
        label="Descripción"
        name="description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Describe el producto en detalle..."
        className="text-sm placeholder:text-sm"
        required
      />

      <Input
        label="URL de la imagen"
        name="image"
        type="url"
        value={values.image}
        onChange={handleChange}
        error={errors.image}
        placeholder="https://ejemplo.com/imagen.jpg"
        className="text-sm placeholder:text-sm"
        required
      />

      {/* Image preview */}
      {values.image && (
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
          <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.image}
              alt="Vista previa"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=Error";
              }}
            />
          </div>
        </div>
      )}

      {/* Error from mutation */}
      {createProduct.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            {(createProduct.error as { message?: string }).message ||
              "Error al crear el producto"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          size="sm"
          variant="primary"
          isLoading={isSubmitting || createProduct.isPending}
          className="flex-1"
        >
          Crear producto
        </Button>
        {onCancel && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
