import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../../api/categories";
interface Category {
  id: number;
  name: string;
}

const BarDropdown: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải danh mục...</div>;

  return (
    <div className="absolute left-36 top-32 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-md z-50 overflow-hidden">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="block px-5 py-2 border-t-2 text-sm hover:bg-blue-400 hover:text-white transition duration-150"
        >
          {category.name.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};

export default BarDropdown;
