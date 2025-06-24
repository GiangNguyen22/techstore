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
      <div className="h-[500px] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      {/* <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4"> */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6 border border-red-100">

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => deleteProductMutation.mutate()}
              disabled={deleteProductMutation.status === "pending"}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {deleteProductMutation.status === "pending" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xóa...
                </div>
              ) : (
                "Xác nhận xóa"
              )}
            </button>
            <button
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-[1200px] mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
    style={{ maxHeight: '90vh' }}
  >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            {formMode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </h2>
          <p className="text-blue-100 mt-1">
            {formMode === "add" ? "Điền thông tin để tạo sản phẩm mới" : "Cập nhật thông tin sản phẩm"}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá (VND) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
                    required
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm font-medium">₫</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-semibold text-gray-700 mb-2">
                  Số lượng tồn kho *
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min={0}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Hãng sản xuất *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập tên hãng"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại sản phẩm *
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập loại sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục *
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                  <SelectCategory categories={categories} setIdCategory={setIdCategory} />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả sản phẩm *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </div>

          {/* Variants Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v12a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Biến thể sản phẩm</h3>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Màu sắc</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Đỏ, Xanh..."
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Kích cỡ</label>
                      <input
                        type="text"
                        placeholder="S, M, L, XL..."
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={variant.stockQuantity}
                        onChange={(e) => handleVariantChange(index, "stockQuantity", Number(e.target.value))}
                        min={0}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        disabled={variants.length === 1}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                        title={variants.length === 1 ? "Phải có ít nhất 1 biến thể" : "Xóa biến thể"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 border-2 border-dashed border-blue-300 hover:border-blue-400"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm biến thể mới
                </span>
              </button>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ảnh sản phẩm
            </label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                accept="image/*"
              />
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF tối đa 10MB</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                addProductMutation.status === "pending" ||
                editProductMutation.status === "pending" ||
                deleteProductMutation.status === "pending"
              }
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {formMode === "add" ? (
                addProductMutation.status === "pending" ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang thêm sản phẩm...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm
                  </div>
                )
              ) : formMode === "edit" ? (
                editProductMutation.status === "pending" ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu thay đổi...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu thay đổi
                  </div>
                )
              ) : (
                "Xác nhận"
              )}
            </button>
            
            <button
              type="button"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;