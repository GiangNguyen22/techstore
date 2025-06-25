import React, { useEffect, useState } from "react";
import SelectCategory from "../../../pages/DashBoard/pages/EditProduct/components/SelectCategory";
import { getCategories } from "../../../api/categories";
import { addProduct } from "../../../api/products";
import { useNotification } from "../../../pages/Detail/NotificationProvider";
interface CategoryType {
  id: number;
  name: string;
}

const AddProductContent = () => {
  const [categories, setCategories] = useState<CategoryType[] | null>(null);

  // State cho categoryId kiểu number
  const [categoryId, setCategoryId] = useState<number>(0);
  const { showMessage } = useNotification(); // Sử dụng hook thông báo

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "", // sẽ cập nhật khi select thay đổi
    status: "active",
    stockQuantity: ""
  });

  // Lấy categories từ API khi mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setCategoryId(data[0].id);
          setProduct((prev) => ({
            ...prev,
            categoryId: String(data[0].id),
          }));
        }
      } catch (err) {
        setCategories([]);
                showMessage("Lỗi tải danh mục!", "error");

      }
    };
    fetchCategories();
  }, []);

  // Khi thay đổi categoryId, cập nhật vào product
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      categoryId: String(categoryId),
    }));
  }, [categoryId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...product,
      price: Number(product.price),
      categoryId: Number(product.categoryId),
    };
    try {
      await addProduct(payload); // Gọi API thêm sản phẩm
      showMessage("Thêm sản phẩm thành công!", "success"); // Thông báo thành công
      setProduct({
        name: "",
        description: "",
        price: "",
        categoryId: categories && categories[0] ? String(categories[0].id) : "",
        status: "active",
        stockQuantity: ""
      });
      setCategoryId(categories && categories[0] ? categories[0].id : 0);
    } catch (error) {
      showMessage("Thêm sản phẩm thất bại!", "error"); // Thông báo lỗi
      console.error("Add product error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border h-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            min={0}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>
        {/* Category - dùng SelectCategory */}
        <div>
          <SelectCategory
            categories={categories}
            setIdCategory={setCategoryId}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductContent;
