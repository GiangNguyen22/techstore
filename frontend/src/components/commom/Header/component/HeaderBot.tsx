import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const HeaderBot: React.FC<HeaderBotProps> = ({
  botMenuOpen,
  setBotMenuOpen,
}) => {
  const location = useLocation();

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
    <div className="bg-white h-16 flex items-center px-40 shadow-sm border-t border-orange-300 relative z-30">
      {/* Nút danh mục sản phẩm */}
      <div
        className="relative h-full flex items-center cursor-pointer px-4 rounded-xl hover:bg-orange-100 transition duration-200"
        onClick={() => setBotMenuOpen(!botMenuOpen)}
      >
        <button className="flex items-center gap-2 text-orange-600 font-semibold text-base tracking-wide">
          <FaBars className="text-lg" />
          <span>Danh mục</span>
        </button>

        {botMenuOpen && (
          <div className="absolute top-full left-0 w-64 bg-white border border-orange-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto mt-2">
            {categories.length === 0 ? (
              <p className="p-4 text-gray-500">Đang tải danh mục...</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-4 py-3 text-slate-800 hover:bg-orange-600 hover:text-white font-medium border-t border-orange-100 transition-all duration-150"
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
          className={`font-semibold tracking-wide px-3 py-2 rounded-lg transition ${
            location.pathname === "/store"
              ? "bg-orange-100 text-orange-600"
              : "text-slate-800 hover:text-orange-600 hover:bg-orange-100"
          }`}
        >
          Store
        </Link>

        <Link
          to="/aboutUs"
          className={`font-semibold tracking-wide px-3 py-2 rounded-lg transition ${
            location.pathname === "/aboutUs"
              ? "bg-orange-100 text-orange-600"
              : "text-slate-800 hover:text-orange-600 hover:bg-orange-100"
          }`}
        >
          Về chúng tôi
        </Link>

        <Link
          to="/lienhe"
          className={`font-semibold tracking-wide px-3 py-2 rounded-lg transition ${
            location.pathname === "/lienhe"
              ? "bg-orange-100 text-orange-600"
              : "text-slate-800 hover:text-orange-600 hover:bg-orange-100"
          }`}
        >
          Liên hệ
        </Link>
      </nav>
    </div>
  );
};

export default HeaderBot;
