import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import { FaShoppingBag, FaBars } from "react-icons/fa";
import HeaderTop from "./component/HeaderTop";
import HeaderBot from "./component/HeaderBot";
import BarDropdown from "./component/BarDropdown";

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [botMenuOpen, setBotMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const accountRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const botMenuRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  setIsLoggedIn(!!accessToken);
  setUserEmail(user?.email || null);
  setUserName(user?.name || null);
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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (
        botMenuRef.current &&
        !botMenuRef.current.contains(event.target as Node)
      ) {
        setBotMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setUserEmail(null);
  setUserName(null);
  setAccountOpen(false);
};


  const HeaderContent = ({ isScrolled = false }: { isScrolled?: boolean }) => (
    <div className="bg-white flex items-center justify-between px-40 py-3 shadow-md relative">
      <div className="flex items-center space-x-4">
        {isScrolled && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <FaBars />
          </button>
        )}
        <Link to="/" className="flex items-center">
          <img
            src="https://cdn.mykiot.vn/2022/10/1666152047a4cf9554e4097312a1e5262a3f84f5ba.png"
            alt="Logo"
            className="h-32"
          />
        </Link>
      </div>

      <div className="relative w-1/2">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Nhập Mã Hoặc Tên Sản Phẩm Để Tìm Kiếm..."
          className="w-full border border-gray-300 rounded-full py-2 px-5 pr-12 text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
        />
        <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-800 text-xl cursor-pointer" />
      </div>

      <div className="flex items-center space-x-6">
        <div ref={accountRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAccountOpen(!accountOpen);
            }}
            className="flex items-center border border-gray-300 rounded-full px-4 py-2 cursor-pointer hover:border-blue-600 hover:bg-blue-400 transition-colors duration-300 group"
          >
            <FiUser className="text-xl mr-2 text-gray-800 group-hover:text-white transition-colors duration-300" />
            <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
              {isLoggedIn ? userName || "Tài khoản" : "Tài khoản"}
            </span>
            <span className="ml-1 select-none text-gray-600 group-hover:text-white transition-colors duration-300">
              ▼
            </span>
          </button>

          {accountOpen && (
            <div className="absolute -left-2 mt-2 w-48 bg-white border border-gray-300 rounded-2xl shadow-md z-50 overflow-hidden">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/account"
                    className="block px-6 py-2 hover:bg-gray-200 transition-colors duration-200 text-blue-600"
                    onClick={() => setAccountOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-2 hover:bg-gray-200 transition-colors duration-200 text-red-500"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-10 py-2 hover:bg-gray-200 transition-colors duration-200 rounded-t-2xl text-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOpen(false);
                    }}
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    to="/register"
                    className="block px-12 py-2 hover:bg-gray-200 transition-colors duration-200 border-t border-gray-300 rounded-b-2xl text-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAccountOpen(false);
                    }}
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
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-blue-600 hover:bg-blue-400 group transition-colors duration-300"
        >
          <FaShoppingBag className="text-2xl text-gray-800 group-hover:text-white transition-colors duration-300" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            0
          </span>
        </Link>
      </div>

      {isScrolled && menuOpen && (
        <div ref={menuRef}>
          <BarDropdown />
        </div>
      )}
    </div>
  );

  return (
    <>
      <HeaderTop />

      <div className="top-0 left-0 right-0 mt-2">
        <HeaderContent isScrolled={false} />
      </div>

      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-white ${
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
