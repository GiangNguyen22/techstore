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
import Sidebar from "../../Sidebar";
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

  const handleAdd = async (newProduct: any) => {
    try {
      await addProduct(newProduct);
      setOpen(false);
      refetchProducts();
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
    }
  };

  const handleEdit = async (updatedProduct: any) => {
    try {
      if (!("id" in updatedProduct)) throw new Error("Product id missing");
      await updateProduct(updatedProduct.id, updatedProduct);
      setOpen(false);
      refetchProducts();
    } catch (error) {
      console.error("Lỗi sửa sản phẩm:", error);
    }
  };

  const handleDelete = async (productToDelete: any) => {
    try {
      if (!("id" in productToDelete)) throw new Error("Product id missing");
      await deleteProduct(productToDelete.id);
      setOpen(false);
      refetchProducts();
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
    }
  };

  if (productLoading || categoryLoading) return <div>Loading...</div>;
  if (productError)
    return <div>Error loading products: {productError.message}</div>;
  if (categoryError)
    return <div>Error loading categories: {categoryError.message}</div>;
  console.log("Category data:", categoryData);
  console.log("Product data:", productData);

  return (
    <div className="flex bg-blue-50 gap-20 h-screen">
      <Sidebar />
      <div className="p-6 w-full">
        <ProductModal
          open={open}
          setOpen={setOpen}
          categoryData={categoryData}
          product={
            !product || Object.keys(product).length === 0 ? null : product
          }
          formMode={formMode}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

        <ul className="grid grid-cols-4 gap-4">
          {productData?.map((item: Product) => (
            <li key={item.id}>
              <Card className="p-4 space-y-2">
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div>
                  💰 <strong>Giá:</strong> {item.price.toLocaleString()} VND
                </div>
                <div>
                  🏢 <strong>Hãng:</strong> {item.companyName}
                </div>
                <div>
                  📦 <strong>Tồn kho:</strong> {item.stockQuantity}
                </div>
                <div>
                  🏷️ <strong>Loại:</strong> {item.type}
                </div>

                {/* Hiển thị biến thể nếu có */}
                {Array.isArray(item.variants) &&
                  item.variants.map((v, idx) => (
                    <li key={idx}>
                      Màu: <span className="font-medium">{v.color}</span>, Kích
                      cỡ: <span className="font-medium">{v.size}</span>, Số
                      lượng:{" "}
                      <span className="font-medium">{v.stockQuantity}</span>
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
        </ul>
      </div>
    </div>
  );
};

export default EditProduct;
