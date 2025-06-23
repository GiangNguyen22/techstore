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
    <div className="bg-white h-20 flex items-center px-40 shadow-sm border-t border-orange-200 relative rounded-xl">
      {/* Nút danh mục sản phẩm */}
      <div
        className="relative h-full flex items-center cursor-pointer hover:bg-orange-200 px-4 rounded-xl transition duration-200"
        onClick={() => setBotMenuOpen(!botMenuOpen)}
      >
        <button className="flex items-center gap-2 text-orange-600 font-semibold text-base">
          <FaBars className="text-lg" />
          <span>Danh Mục Sản Phẩm</span>
        </button>

        {botMenuOpen && (
          <div className="absolute top-full left-0  w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="p-4 text-gray-500">Đang tải danh mục...</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-4 py-3 hover:bg-orange-500 hover:text-white transition-all duration-150 text-gray-700 font-medium border-t"
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
      <nav className="ml-10 flex space-x-8">
        <Link
          to="/store"
          className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 px-3 py-2 rounded-xl hover:bg-orange-200"
        >
          Store
        </Link>
        <Link
          to="/lien-he"
          className="text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 px-3 py-2 rounded-xl hover:bg-orange-200"
        >
          Liên Hệ
        </Link>
      </nav>
    </div>
  );
};

export default HeaderBot;
