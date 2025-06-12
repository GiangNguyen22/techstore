import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { getCategories } from "../../../../api/categories";
interface HeaderBotProps {
  botMenuOpen: boolean;
  setBotMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Category {
  id: number;
  name: string;
}

const HeaderBot: React.FC<HeaderBotProps> = ({ botMenuOpen, setBotMenuOpen }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-teal-400 h-20 flex items-center px-40 border-gray-300 relative rounded-xl">
      {/* Danh mục sản phẩm với icon bars */}
      <div
        className="relative h-full py-6 hover:bg-blue-200 cursor-pointer rounded-xl"
        onClick={() => setBotMenuOpen(!botMenuOpen)}
      >
        <button className="flex items-center space-x-2 px-4">
          <FaBars />
          <span>Danh Mục Sản Phẩm</span>
        </button>

        {botMenuOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-300 rounded-xl shadow-lg z-50
                       max-h-64 overflow-y-auto"
          >
            {categories.length === 0 ? (
              <p className="p-4 text-gray-500">Đang tải danh mục...</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-4 py-3 border-t-2 hover:bg-blue-400 hover:text-white transition-colors font-bold cursor-pointer"
                  onClick={() => setBotMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Các mục chính khác */}
      <nav className="flex h-full py-6 hover:bg-blue-200 cursor-pointer rounded-xl space-x-8 ml-7 w-28 px-5">
        <Link
          to="/gioi-thieu"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Giới thiệu
        </Link>
      </nav>
      <nav className="flex h-full py-6 hover:bg-blue-200 cursor-pointer rounded-xl space-x-8 ml-7 w-28 px-7">
        <Link
          to="/lien-he"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Liên Hệ
        </Link>
      </nav>
    </div>
  );
};

export default HeaderBot;
