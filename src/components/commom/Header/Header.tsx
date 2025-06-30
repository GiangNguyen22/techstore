// ... (các import như cũ)
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { FaShoppingBag, FaBars } from "react-icons/fa";
import HeaderTop from "./component/HeaderTop";
import HeaderBot from "./component/HeaderBot";
import { getACart } from "../../../api/cart";
import { getCategories } from "../../../api/categories";
import InputSearch from "../InputSearch";
import { Navigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [botMenuOpen, setBotMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const accountRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const botMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isShown = window.scrollY > 400;
      setShowHeader(isShown);
      if (isShown) {
        setMenuOpen(false);
        setAccountOpen(false);
        setBotMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (botMenuRef.current && !botMenuRef.current.contains(target)) {
        setBotMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const updatedItems = customEvent.detail as any[];
      const totalQty = updatedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCartCount(totalQty);
    };
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    setIsLoggedIn(!!accessToken);
    setUserEmail(user?.email || null);
    setUserName(user?.name || null);

    const fetchInitialCart = async () => {
      try {
        const data = await getACart();
        const items = data.items || [];
        const total = items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        );
        setCartCount(total);
      } catch (err) {
        console.error("Không thể load cart ban đầu:", err);
        setCartCount(0);
      }
    };

    fetchInitialCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    setAccountOpen(false);

    // 🔄 Reload trang để cập nhật lại mọi thứ
    navigate("/");
    window.location.reload();
  };

  const HeaderContent = ({ isScrolled = false }: { isScrolled?: boolean }) => (
    <div className=" flex items-center justify-between px-40 py-3 shadow-md relative h-28">
      <div className="flex items-center space-x-4">
        {isScrolled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="text-2xl text-gray-800 hover:text-orange-600 focus:outline-none"
          >
            <FaBars />
          </button>
        )}
        {isScrolled && menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-28 left-32 mt-2 w-56 bg-white border
             border-gray-300 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {categories.length === 0 ? (
              <p className="p-4 text-gray-500">Đang tải danh mục...</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-4 py-3  hover:bg-orange-500 hover:text-white transition-colors font-bold cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))
            )}
          </div>
        )}
        <Link
          to="/"
          className="text-2xl font-bold text-slate-800 tracking-wide"
        >
          <span className="text-orange-500">Tech</span>Store
        </Link>
      </div>

      <div className="relative w-1/2">
        <InputSearch />
      </div>

      <div className="flex items-center space-x-6">
        <div ref={accountRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAccountOpen((prev) => !prev);
            }}
            className="flex items-center border border-gray-300 bg-white rounded-full px-4 py-2 cursor-pointer hover:border-orange-500 hover:bg-orange-500 transition-colors duration-300 group"
          >
            <FiUser className="text-xl mr-2 text-gray-800 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-800 group-hover:text-white">
              {isLoggedIn ? userName || "Tài khoản" : "Tài khoản"}
            </span>
            <span className="ml-1 text-gray-600 group-hover:text-white">▼</span>
          </button>

          {accountOpen && (
            <div
              className="absolute -left-2 mt-2 w-48 bg-white border border-gray-300
             rounded-2xl shadow-md z-50 overflow-hidden"
            >
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-6 py-2 hover:bg-orange-100 text-orange-600"
                    onClick={() => setAccountOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-2 hover:bg-orange-100 text-red-500"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-10 py-2 hover:bg-orange-100 text-yellow-600"
                    onClick={() => setAccountOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block px-12 py-2 hover:bg-orange-100 border-t border-gray-300 text-green-500"
                    onClick={() => setAccountOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <Link
          to="/cart"
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-orange-500 hover:bg-orange-500 group transition-colors duration-300"
        >
          <FaShoppingCart className="text-2xl text-gray-800 group-hover:text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="top-0 left-0 right-0 mt-2">
        <HeaderContent isScrolled={false} />
      </div>

      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-white
           shadow-md border-b border-orange-300 ${
             showHeader
               ? "opacity-100 translate-y-0"
               : "opacity-0 -translate-y-full"
           }`}
      >
        <HeaderContent isScrolled={true} />
      </div>

      <div ref={botMenuRef}>
        <HeaderBot botMenuOpen={botMenuOpen} setBotMenuOpen={setBotMenuOpen} />
      </div>
    </>
  );
};

export default Header;
