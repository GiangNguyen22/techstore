import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  uploadImageProduct,
} from "../../../../../api/products";
import SelectCategory from "./SelectCategory";
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
  categories: any[];
  product: Product | null;
  formMode: "add" | "edit" | "delete";
  onAdd: (newProduct: any) => Promise<void>;
  onEdit: (updatedProduct: any) => Promise<void>;
  onDelete: (productToDelete: any) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  setOpen,
  categories,
  product,
  formMode,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (product) {
      return {
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stockQuantity: product.stockQuantity || 0,
        type: product.type || "",
        companyName: product.companyName || "",
      };
    }
    return {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      type: "",
      companyName: "",
    };
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [idCategory, setIdCategory] = useState<string>(() => {
    if (product && typeof product.categoryId === "number") {
      return product.categoryId.toString();
    }
    return categories.length > 0 ? categories[0].id.toString() : "";
  });

const [variants, setVariants] = useState<ProductVariantFormData[]>(
  product?.variants?.length
    ? product.variants.map((v: any) => ({
        color: v.color || "",
        size: v.size || "",
        stockQuantity: v.stockQuantity || 0,
      }))
    : [{ color: "", size: "", stockQuantity: 0 }]
);

  const queryClient = useQueryClient();

const addProductMutation = useMutation({
  mutationFn: async () => {
    const newProduct = {
      ...formData,
      categoryId: Number(idCategory),
      variants: variants,  // dùng variantList đúng tên entity backend
    };
        console.log("Submitting new product:", newProduct); // 👈 Kiểm tra tại đây

    return await addProduct(newProduct);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products-admin"] });
    setOpen(false);
  },
});

const editProductMutation = useMutation({
  mutationFn: async () => {
    if (!product) throw new Error("Product is null");
    const updatedProduct = {
      ...formData,
      categoryId: Number(idCategory),
      variants: variants,
    };
    return await updateProduct(product.id, updatedProduct);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products-admin"] });
    setOpen(false);
  },
});


  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Product is null");
      return await deleteProduct(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      setOpen(false);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      if (!product || !imageFile) return;
      const imageData = new FormData();
      imageData.append("image", imageFile);
      return await uploadImageProduct(product.id.toString(), imageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "add") {
      addProductMutation.mutate();
    } else if (formMode === "edit") {
      editProductMutation.mutate();
      if (imageFile) {
        uploadImageMutation.mutate();
      }
    } else if (formMode === "delete") {
      deleteProductMutation.mutate();
    }
  };

  if (formMode === "delete") {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-lg">Bạn có chắc chắn muốn xoá sản phẩm này?</p>
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Xác nhận xoá
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow space-y-4"
    >
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Tên sản phẩm
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="description">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="price">
          Giá (VND)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="stockQuantity">
          Số lượng
        </label>
        <input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="companyName">
          Hãng sản xuất
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="type">
          Loại sản phẩm
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <SelectCategory categories={categories} setIdCategory={setIdCategory} />

      {/* Product Variants */}
      <div className="space-y-2">
        <p className="font-semibold">Biến thể sản phẩm</p>
      {variants.map((variant, index) => (
  <div key={index} className="grid grid-cols-4 gap-2">
    <input
      type="text"
      placeholder="Màu sắc"
      value={variant.color}
      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
      className="p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Kích cỡ"
      value={variant.size}
      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
      className="p-2 border rounded"
    />
    <input
      type="number"
      placeholder="Số lượng"
      value={variant.stockQuantity}
      onChange={(e) =>
        handleVariantChange(index, "stockQuantity", Number(e.target.value))
      }
      className="p-2 border rounded"
    />
  </div>
))}

        <button
          type="button"
          onClick={() =>
            setVariants([...variants, { color: "", size: "", stockQuantity: 0 }])
          }
          className="text-blue-600 hover:underline text-sm"
        >
          + Thêm biến thể
        </button>
      </div>

      {formMode === "edit" && (
        <div>
          <label className="block font-medium mb-1" htmlFor="image">
            Ảnh sản phẩm
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {formMode === "add" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
      </button>
    </form>
  );
};

export default ProductForm;
