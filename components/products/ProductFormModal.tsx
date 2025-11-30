"use client";

import { useState, useCallback } from "react";
import { useForm } from "@/lib/hooks/useForm";
import {
  Product,
  CreateProductSerializer,
  PRODUCT_CATEGORIES,
} from "@/lib/types/product";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { z } from "zod";
import { productSchema } from "@/lib/schemas/product";
import { mapZodErrors } from "@/lib/helpers/zodErrors";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product; // If provided, we're editing; otherwise, creating
  onSuccess?: () => void;
}

const getInitialValues = (product?: Product): ProductFormValues => ({
  title: product?.title ?? "",
  price: product?.price ?? 0,
  description: product?.description ?? "",
  category: (product?.category ?? "") as ProductFormValues["category"],
  image:
    product?.image ??
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
});

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const isEditing = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormValues, string>>
  >({});

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } =
    useForm<ProductFormValues>({
      initialValues: getInitialValues(product),
      onSubmit: async (formValues: ProductFormValues) => {
        const result = productSchema.safeParse(formValues);

        if (!result.success) {
          setErrors(mapZodErrors<ProductFormValues>(result.error));
          return;
        }

        setErrors({});

        const productData: CreateProductSerializer = {
          title: formValues.title,
          price: formValues.price,
          description: formValues.description,
          category: formValues.category,
          image: formValues.image,
        };

        if (isEditing && product) {
          await updateProduct.mutateAsync({
            id: product.id,
            data: productData,
          });
        } else {
          await createProduct.mutateAsync(productData);
        }

        handleClose();
        onSuccess?.();
      },
    });

  const handleClose = useCallback(() => {
    resetForm();
    setErrors({});
    onClose();
  }, [resetForm, onClose]);

  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
  }));

  const isPending =
    isSubmitting || createProduct.isPending || updateProduct.isPending;
  const mutationError = createProduct.error || updateProduct.error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Editar producto" : "Crear nuevo producto"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          rows={3}
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
          <div className="border border-[#2a2a3a] rounded-lg p-4 bg-[#151520]">
            <p className="text-sm text-slate-400 mb-2">Vista previa:</p>
            <div className="w-24 h-24 bg-[#0f0f14] rounded-lg overflow-hidden mx-auto">
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
        {mutationError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              {(mutationError as { message?: string }).message ||
                `Error al ${isEditing ? "actualizar" : "crear"} el producto`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[#2a2a3a]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isPending}
            className="flex-1"
          >
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
