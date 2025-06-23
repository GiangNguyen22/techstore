import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectCategory from "./SelectCategory";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  uploadThumbnail,
} from "../../../../../api/products";
import { Product } from "../../../../../types/Product.type";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  type: string;
  companyName: string;
}

interface ProductVariantFormData {
  color: string;
  size: string;
  stockQuantity: number;
}

interface ProductFormProps {
  setOpen: (open: boolean) => void;
  categories: { id: number; name: string }[];
  product: Product | null;
  formMode: "add" | "edit" | "delete";
  onAdd?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  setOpen,
  categories,
  product,
  formMode,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stockQuantity: product?.stockQuantity || 0,
    type: product?.type || "",
    companyName: product?.companyName || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [idCategory, setIdCategory] = useState<number>(
    product?.categoryId || (categories.length > 0 ? categories[0].id : 0)
  );

  const [variants, setVariants] = useState<ProductVariantFormData[]>(
    product?.variants?.length
      ? product.variants.map((v) => ({
          color: v.color || "",
          size: v.size || "",
          stockQuantity: v.stockQuantity || 0,
        }))
      : [{ color: "", size: "", stockQuantity: 0 }]
  );

  // Mutation thêm sản phẩm
  const addProductMutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl = "";

      if (imageFile) {
        thumbnailUrl = await uploadThumbnail(imageFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        type: formData.type,
        companyName: formData.companyName,
        categoryId: idCategory,
        variants,
        thumbnail: thumbnailUrl,
      };

      return await addProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      setOpen(false);
      onAdd && onAdd(null);
    },
  });

  // Mutation sửa sản phẩm
  const editProductMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Sản phẩm không tồn tại");

      let thumbnailUrl = product.thumbnail || "";

      if (imageFile) {
        thumbnailUrl = await uploadThumbnail(imageFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        type: formData.type,
        companyName: formData.companyName,
        categoryId: idCategory,
        variants,
        thumbnail: thumbnailUrl,
      };

      return await updateProduct(product.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      setOpen(false);
      onEdit && onEdit(null);
    },
  });

  // Mutation xoá sản phẩm
  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Sản phẩm không tồn tại");
      return await deleteProduct(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      setOpen(false);
      onDelete && onDelete(null);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantFormData,
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", size: "", stockQuantity: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] || null);
  };

  // Bước 4: handleSubmit gọi mutation tương ứng
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formMode === "add") {
      addProductMutation.mutate();
    } else if (formMode === "edit") {
      editProductMutation.mutate();
    }
    // Nếu xoá thì xử lý riêng (không phải submit form)
  };

  // Giao diện cho xoá sản phẩm
  if (formMode === "delete") {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-lg font-semibold">
          Bạn có chắc chắn muốn xoá sản phẩm này?
        </p>
        <button
          onClick={() => deleteProductMutation.mutate()}
          disabled={deleteProductMutation.status === "pending"}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleteProductMutation.status === "pending"
            ? "Đang xoá..."
            : "Xác nhận xoá"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow space-y-4 max-w-xl mx-auto"
    >
      {/* Form nhập liệu */}
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Tên sản phẩm
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="price" className="block font-medium mb-1">
          Giá (VND)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="stockQuantity" className="block font-medium mb-1">
          Số lượng
        </label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          min={0}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="companyName" className="block font-medium mb-1">
          Hãng sản xuất
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="type" className="block font-medium mb-1">
          Loại sản phẩm
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Danh mục</label>
        <SelectCategory categories={categories} setIdCategory={setIdCategory} />
      </div>

      <div className="space-y-3">
        <p className="font-semibold">Biến thể sản phẩm</p>
        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 items-center">
            <input
              type="text"
              placeholder="Màu sắc"
              value={variant.color}
              onChange={(e) =>
                handleVariantChange(index, "color", e.target.value)
              }
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Kích cỡ"
              value={variant.size}
              onChange={(e) =>
                handleVariantChange(index, "size", e.target.value)
              }
              required
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={variant.stockQuantity}
              onChange={(e) =>
                handleVariantChange(
                  index,
                  "stockQuantity",
                  Number(e.target.value)
                )
              }
              min={0}
              required
              className="p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              disabled={variants.length === 1}
              className="text-red-600 font-bold"
              title={
                variants.length === 1
                  ? "Phải có ít nhất 1 biến thể"
                  : "Xoá biến thể"
              }
            >
              &times;
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddVariant}
          className="mt-2 text-blue-600 font-semibold"
        >
          + Thêm biến thể
        </button>
      </div>

      <div>
        <label className="block font-medium mb-1">Ảnh sản phẩm</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <button
        type="submit"
        disabled={
          addProductMutation.status === "pending" ||
          editProductMutation.status === "pending" ||
          deleteProductMutation.status === "pending"
        }
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {formMode === "add"
          ? addProductMutation.status === "pending"
            ? "Đang thêm..."
            : "Thêm sản phẩm"
          : formMode === "edit"
          ? editProductMutation.status === "pending"
            ? "Đang lưu..."
            : "Lưu thay đổi"
          : "Xác nhận xoá"}
      </button>
    </form>
  );
};

export default ProductForm;
