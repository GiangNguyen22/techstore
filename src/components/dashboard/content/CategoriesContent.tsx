import { Hand, Plus, Edit, Trash2, Save, X } from "lucide-react";
import Table from "../../../pages/DashBoard/Table";

import "rc-pagination/assets/index.css";
import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../../api/categories";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  products?: number; // Optional product count
}

const CategoriesContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Thêm category
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [adding, setAdding] = useState(false);

  // Sửa category
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Lấy danh sách categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      // Thêm mock product count nếu API không trả về
      const categoriesWithProducts = data.map((cat: Category) => ({
        ...cat,
        products: cat.products || Math.floor(Math.random() * 100) + 1
      }));
      setCategories(categoriesWithProducts);
    } catch (err: any) {
      setError("Lỗi khi tải danh sách");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Thêm category mới
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Tên category không được để trống");
      return;
    }
    setAdding(true);
    try {
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      setShowAddForm(false);
      await fetchCategories();
    } catch (error: any) {
      console.error("Lỗi chi tiết:", error);
      alert(
        "Thêm thất bại: " +
          (error.response?.data?.message || "Lỗi không xác định")
      );
    } finally {
      setAdding(false);
    }
  };

  // Xoá category
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá category này?")) return;
    try {
      await deleteCategory(id.toString());
      await fetchCategories();
    } catch (err) {
      alert("Xoá category thất bại");
    }
  };

  // Bắt đầu sửa category
  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // Huỷ sửa
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Lưu sửa category
  const saveEditing = async () => {
    if (!editingName.trim()) {
      alert("Tên category không được để trống");
      return;
    }

    if (editingId === null) {
      alert("Không xác định được ID của category cần sửa");
      return;
    }

    try {
      await updateCategory({ categoryId: editingId, name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      await fetchCategories();
    } catch (err) {
      alert("Cập nhật category thất bại");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <Hand className="animate-wiggle-more animate-infinite text-yellow-500" />
        </div>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={adding}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              disabled={adding}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {adding ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName("");
              }}
              disabled={adding}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Plus size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600">No categories found. Add your first category!</p>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {editingId === category.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEditing()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditing}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm transition-colors"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.products || 0} products
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-blue-500 hover:underline">
                      View Products
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesContent;