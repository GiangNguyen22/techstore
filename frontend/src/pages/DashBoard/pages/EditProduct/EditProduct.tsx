import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../../api/products";
import { getCategories } from "../../../../api/categories";
import { Card } from "../../../../components/ui/Card";
import { Product } from "../../../../types/Product.type";
import ProductModal from "./components/ProductModal";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../Sidebar";
const EditProduct = () => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | "delete">("add");
  const [searchParams] = useSearchParams();

  const categoryIdParam = parseInt(searchParams.get("categoryId") || "0", 10);
  const categoryId = categoryIdParam > 0 ? categoryIdParam : undefined;

  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products-admin", categoryId],
    queryFn: () => getProducts(categoryId),
  });

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
  } = useQuery({
    queryKey: ["categories-admin"],
    queryFn: () => getCategories(),
  });
  const getCategoryName = (id: number) => {
    if (!categoryData) return "";
    const found = categoryData.find((c: any) => c.id === id);
    return found ? found.name : "";
  };
  // Hàm thống nhất cho Add/Edit/Delete
  const handleSubmit = async (
    mode: "add" | "edit" | "delete",
    productData: any
  ) => {
    try {
      if (mode === "add") {
        await addProduct(productData);
      } else if (mode === "edit") {
        if (!("id" in productData)) throw new Error("Product id missing");
        await updateProduct(productData.id, productData);
      } else if (mode === "delete") {
        if (!("id" in productData)) throw new Error("Product id missing");
        await deleteProduct(productData.id);
      }
      setOpen(false);
      refetchProducts();
    } catch (error: any) {
      console.error(`Lỗi ${mode} sản phẩm:`, error);

      let message = "Đã xảy ra lỗi!";

      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (typeof error === "string") {
        message = error;
      } else if (error?.message) {
        message = error.message;
      } else {
        message = JSON.stringify(error); // fallback
      }
      

      alert(`❌ ${message}`);
    }
  };

  if (productLoading || categoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="text-lg font-semibold">Lỗi tải sản phẩm:</p>
          <p className="text-sm mt-2">{(productError as Error).message}</p>
        </div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="text-lg font-semibold">Lỗi tải danh mục:</p>
          <p className="text-sm mt-2">{(categoryError as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-blue-50 gap-20 h-auto">
      <div className="p-6 w-full">
        <ProductModal
          open={open}
          setOpen={setOpen}
          categoryData={categoryData}
          product={
            !product || Object.keys(product).length === 0 ? null : product
          }
          formMode={formMode}
          onSubmit={handleSubmit}
        />

        {/* Products Grid */}
        {productData && productData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {productData.map((item: Product) => (
              <div key={item.id} className="group">
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden rounded-3xl">
                  {/* Card Content */}
                  <div className="p-6 flex flex-col h-full">
                    {/* Product Header */}
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 mb-6 flex-grow">
                      {/* Price */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                        <span className="text-sm font-medium text-slate-700 flex items-center">
                          💰 Giá bán
                        </span>
                        <span className="font-bold text-emerald-600 text-lg">
                          {item.price.toLocaleString()} VND
                        </span>
                      </div>

                      {/* Company and Stock */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                          <div className="text-xs text-violet-600 mb-1 font-medium">
                            🏢 Hãng
                          </div>
                          <div className="font-semibold text-violet-700 text-sm truncate">
                            {item.companyName}
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                          <div className="text-xs text-blue-600 mb-1 font-medium">
                            📦 Tồn kho
                          </div>
                          <div className="font-semibold text-blue-700 text-sm">
                            {item.stockQuantity}
                          </div>
                        </div>
                      </div>

                      {/* Product Type */}
                      {/* <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                        <div className="text-xs text-pink-600 mb-1 font-medium">🏷️ Loại sản phẩm</div>
                        <div className="font-semibold text-pink-700 text-sm">
                          {item.type}
                        </div>
                      </div> */}
                      {/* Category Name */}
                      <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
                        <div className="text-xs text-yellow-600 mb-1 font-medium">
                          📂 Danh mục
                        </div>
                        <div className="font-semibold text-yellow-700 text-sm truncate">
                          {getCategoryName(item.categoryId)}
                        </div>
                      </div>
                      {/* Variants */}
                      {Array.isArray(item.variants) &&
                        item.variants.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              🎨 Biến thể
                            </h4>
                            <div className="space-y-2 max-h-24 overflow-y-auto">
                              {item.variants.map((v, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100"
                                >
                                  <span className="font-semibold text-indigo-600">
                                    Màu:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {v.color}
                                  </span>{" "}
                                  •
                                  <span className="font-semibold text-indigo-600">
                                    {" "}
                                    Size:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {v.size}
                                  </span>{" "}
                                  •
                                  <span className="font-semibold text-indigo-600">
                                    {" "}
                                    SL:
                                  </span>{" "}
                                  <span className="text-slate-700">
                                    {v.stockQuantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setProduct(item);
                          setFormMode("edit");
                          setOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setProduct(item);
                          setFormMode("delete");
                          setOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-8 text-lg">
                Hãy thêm sản phẩm đầu tiên để bắt đầu quản lý cửa hàng của bạn
              </p>
              <button
                onClick={() => {
                  setProduct(null);
                  setFormMode("add");
                  setOpen(true);
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm sản phẩm đầu tiên
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
