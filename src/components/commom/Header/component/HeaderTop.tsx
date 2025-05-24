import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeaderTop = () => {
  return (
    <div className="h-10 bg-yellow-50">
      <div className="ml-40 pt-3 flex gap-7 text-sm font-medium text-gray-600">
        <Link
          to="/"
          className="cursor-pointer hover:text-blue-400 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <Link
          to="/gioi-thieu"
          className="cursor-pointer hover:text-blue-400 transition-colors duration-200"
        >
          Giới thiệu
        </Link>
        <Link
          to="/ban-do"
          className="cursor-pointer hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
        >
          <FaMapMarkerAlt className="text-black" />
          Bản đồ
        </Link>
      </div>
    </div>
  );
};

export default HeaderTop;
