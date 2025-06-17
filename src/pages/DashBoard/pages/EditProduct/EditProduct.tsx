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
    } catch (error) {
      console.error(`Lỗi ${mode} sản phẩm:`, error);
    }
  };

  if (productLoading || categoryLoading) return <div>Loading...</div>;
  if (productError)
    return <div>Error loading products: {(productError as Error).message}</div>;
  if (categoryError)
    return <div>Error loading categories: {(categoryError as Error).message}</div>;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 min-h-screen">
      <div className="w-full">
        <ProductModal
          open={open}
          setOpen={setOpen}
          categoryData={categoryData}
          product={!product || Object.keys(product).length === 0 ? null : product}
          formMode={formMode}
          onSubmit={handleSubmit} // Truyền hàm thống nhất
        />

        <button
          onClick={() => {
            setProduct(null);
            setFormMode("add");
            setOpen(true);
          }}
          className="mb-4 rounded bg-sky-600 py-2 px-4 text-sm text-white"
        >
          Thêm sản phẩm
        </button>

        {/* Products Grid - Tăng độ rộng của mỗi item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
          {productData?.map((item: Product) => (
            <div key={item.id} className="group">
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden rounded-3xl flex flex-col">
                {/* Nội dung sản phẩm - flex-grow để chiếm không gian còn lại */}
                <div className="p-8 flex-grow">
                  {/* Product Header */}
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl text-slate-800 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-base text-slate-500 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm">
                      <span className="text-base font-medium text-slate-700">💰 Giá bán</span>
                      <span className="font-bold text-emerald-600 text-xl">
                        {item.price.toLocaleString()} VND
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 shadow-sm">
                        <div className="text-sm text-violet-600 mb-2 font-medium">🏢 Hãng</div>
                        <div className="font-semibold text-violet-700 text-base truncate">
                          {item.companyName}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm">
                        <div className="text-sm text-blue-600 mb-2 font-medium">📦 Tồn kho</div>
                        <div className="font-semibold text-blue-700 text-base">
                          {item.stockQuantity}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 shadow-sm">
                      <div className="text-sm text-pink-600 mb-2 font-medium">🏷️ Loại sản phẩm</div>
                      <div className="font-semibold text-pink-700 text-base">
                        {item.type}
                      </div>
                    </div>
                  </div>

                  {/* Variants */}
                  {Array.isArray(item.variants) && item.variants.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-slate-700 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        🎨 Biến thể
                      </h4>
                      <div className="space-y-3 max-h-32 overflow-y-auto">
                        {item.variants.map((v, idx) => (
                          <div key={idx} className="text-sm bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-l-4 border-gradient-to-b border-indigo-400 shadow-sm">
                            <span className="font-semibold text-indigo-600">Màu:</span> <span className="text-slate-700">{v.color}</span> • 
                            <span className="font-semibold text-indigo-600"> Size:</span> <span className="text-slate-700">{v.size}</span> • 
                            <span className="font-semibold text-indigo-600"> SL:</span> <span className="text-slate-700">{v.stockQuantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hiển thị biến thể nếu có */}
                {Array.isArray(item.variants) &&
                  item.variants.map((v, idx) => (
                    <li key={idx} className="ml-4 list-disc">
                      Màu: <span className="font-medium">{v.color}</span>, Kích
                      cỡ: <span className="font-medium">{v.size}</span>, Số
                      lượng: <span className="font-medium">{v.stockQuantity}</span>
                    </li>
                  ))}
              </Card>

              <div className="w-full flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setProduct(item);
                    setFormMode("edit");
                    setOpen(true);
                  }}
                  className="rounded bg-sky-600 py-2 px-4 text-sm text-white w-1/2"
                >
                  Sửa sản phẩm
                </button>
                <button
                  onClick={() => {
                    setProduct(item);
                    setFormMode("delete");
                    setOpen(true);
                  }}
                  className="rounded bg-red-600 py-2 px-4 text-sm text-white w-1/2"
                >
                  Xoá sản phẩm
                </button>
              </div>
            </li>
          ))}
        </div>

        {/* Empty State */}
        {productData?.length === 0 && (
          <div className="text-center py-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-6 text-lg font-medium">Hãy thêm sản phẩm đầu tiên để bắt đầu</p>
              <button
                onClick={() => {
                  setProduct(null);
                  setFormMode("add");
                  setOpen(true);
                }}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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