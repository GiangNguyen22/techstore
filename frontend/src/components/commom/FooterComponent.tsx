import React from "react";
import { FaFacebookF, FaTiktok, FaYoutube, FaStore, FaPaperPlane } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="bg-black text-white py-10 text-sm mt-10">
      <div className="container mx-auto px-4 flex flex-wrap justify-between">
        {/* Chính sách */}
        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-4">CÁC CHÍNH SÁCH</h3>
          <ul className="space-y-3 text-gray-400">
            {[
              "Điều khoản sử dụng",
              "Chính sách bảo hành",
              "Chính sách kiểm hàng và đổi trả",
              "Chính sách vận chuyển",
              "Chính sách thanh toán",
              "Chính sách bảo vệ dữ liệu cá nhân",
              "CHÍNH SÁCH COOKIE",
            ].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Giới thiệu & Hỗ trợ */}
        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-4">GIỚI THIỆU</h3>
          <ul className="space-y-3 text-gray-400 mb-6">
            {["Xiaomi", "Đội ngũ lãnh đạo", "Xiaomi HyperOS"].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3 className="text-lg font-bold mb-4">HỖ TRỢ</h3>
          <ul className="space-y-3 text-gray-400">
            {["Dịch vụ", "Mua hàng", "Trung tâm Dịch vụ", "Phí sửa chữa dịch vụ đối với điện thoại"].map(
              (item, idx) => (
                <li key={idx}>{item}</li>
              )
            )}
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h3 className="text-lg font-bold mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <p className="text-gray-400 mb-2">
            Email: <a href="mailto:service.vn@support.mi.com">service.vn@support.mi.com</a>
          </p>
          <p className="text-gray-400">Số điện thoại: 1800400410</p>
        </div>

        {/* Mạng xã hội & đăng ký email */}
        <div className="w-full sm:w-1/2 md:w-1/4">
          <h3 className="text-lg font-bold mb-4">THEO DÕI Xiaomi</h3>
          <div className="flex space-x-4 text-xl mb-6">
            <FaFacebookF className="hover:text-orange-500 cursor-pointer" />
            <FaTiktok className="hover:text-orange-500 cursor-pointer" />
            <FaYoutube className="hover:text-orange-500 cursor-pointer" />
            <FaStore className="hover:text-orange-500 cursor-pointer" />
          </div>
          <p className="mb-2 font-bold text-white">
            Nhập địa chỉ email của bạn để đăng ký nhận thông tin
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập địa chỉ Email"
              className="px-3 py-2 w-full rounded-l bg-white text-black focus:outline-none"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600 flex items-center">
              <FaPaperPlane className="mr-2" />
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-xs">
        Copyright © 2023 Xiaomi Việt Nam. All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterComponent;
