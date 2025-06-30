import { Hand } from "lucide-react";
import Table from "./Table";

import "rc-pagination/assets/index.css";
import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../api/categories";
import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
interface Category {
  id: number;
  name: string;
}

const Main = () => {
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
      setCategories(data);
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Quản lý Categories</h1>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-4 py-2 ml-52 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm Category
        </button>
      )}

      {showAddForm && (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="Nhập tên category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={adding}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddCategory}
              disabled={adding}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {adding ? "Đang thêm..." : "Thêm"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName("");
              }}
              disabled={adding}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {isLoading && <p>Đang tải danh sách...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && categories.length === 0 && <p>Chưa có category nào.</p>}

      {!isLoading && categories.length > 0 && (
        <div className="border rounded divide-y">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center p-3"
            >
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    className="border px-2 py-1 rounded flex-grow mr-4"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={saveEditing}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Huỷ
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-grow">{category.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(category)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Xoá
                    </button>
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

export default Main;
