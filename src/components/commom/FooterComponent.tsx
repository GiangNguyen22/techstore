import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto flex flex-wrap justify-between">
        {/* Đăng ký nhận tin */}
        <div className="w-full md:w-1/2 pr-10">
          <h3 className="text-xl font-bold mb-4">ĐĂNG KÝ NHẬN TIN</h3>
          <div className="flex w-full">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-3 rounded-l-sm focus:outline-none text-black"
            />
        <button className="bg-orange-500 px-4 hover:bg-orange-600 py-2 rounded-r-md text-white font-bold flex items-center whitespace-nowrap">
  <FaPaperPlane className="mr-2" /> ĐĂNG KÝ
</button>

          </div>

          {/* Logo & mô tả */}
          <div className="mt-10 md:mt-20 text-left">
            <img
              src="https://vntaacademy.com/wp-content/uploads/2023/10/logo.png"
              alt="VNTA Academy"
              className="w-48 mb-4"
            />
            <span className="text-gray-400 text-lg block">
              VNTA Academy – Học Viện Thể Thao Tennis Và Pickleball Lớn Nhất
              Việt Nam
            </span>
          </div>
        </div>

        {/* Giới thiệu & Chính sách */}
        <div className="w-full md:w-1/2 flex flex-wrap md:flex-nowrap justify-between mt-10 md:mt-0">
          {/* Giới thiệu */}
          <div className="w-1/2">
            <h3 className="text-xl font-bold mb-4">GIỚI THIỆU</h3>
            <ul className="space-y-5">
              {["Giới thiệu", "Huấn Luyện Viên", "Tin tức", "Địa điểm sân tập", "Liên hệ"].map((item, index) => (
                <li key={index} className="relative group">
                  <span className="block transition-all font-bold duration-300 group-hover:translate-x-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chính sách */}
          <div className="w-1/2">
            <h3 className="text-xl font-bold mb-4">CHÍNH SÁCH</h3>
            <ul className="space-y-5">
              {["Chính sách và Điều khoản", "Chính sách bảo mật thông tin", "Chính sách quảng cáo", "Miễn trừ trách nhiệm"].map((item, index) => (
                <li key={index} className="relative group">
                  <span className="block transition-all font-bold duration-300 group-hover:translate-x-2">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Thông tin công ty & thanh toán */}
      <div className="container mx-auto mt-10 border-t-2 border-gray-400 pt-6">
        {/* Thông tin công ty */}
        <h3 className="text-xl font-bold mb-6">CÔNG TY TNHH VNTA VIỆT NAM</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-5 text-gray-100 font-medium">
          <ul className="space-y-4">
            <li>• Địa chỉ: 35 Trần Quý Kiên, Dịch Vọng, Cầu Giấy, Hà Nội</li>
            <li>• Người đại diện: VŨ NGỌC THÀNH</li>
            <li>• Chức vụ: Giám Đốc</li>
            <li>• Loại hình doanh nghiệp: Công Ty TNHH</li>
          </ul>
          <ul className="space-y-4">
            <li>• Mã số thuế: 0108420779</li>
            <li>• Quản lý bởi: Chi cục Thuế</li>
            <li>• Giấy đăng ký hoạt động số 0108420779 được Sở KHĐT Hà Nội cấp ngày 31/08/2018</li>
            <li>• Ngày hoạt động: 31/08/2018</li>
          </ul>
          <ul className="space-y-4">
            <li>• Học Viện VNTA Academy Việt Nam</li>
            <li>• Email: <span className="font-bold text-white">info@vntaacademy.com</span></li>
            <li>• Điện thoại: <span className="font-bold text-white">0931 81 3333</span></li>
          </ul>
        </div>

        {/* Thông tin thanh toán */}
        <h3 className="text-xl font-bold mt-10 mb-6 border-b-2 border-gray-400 pb-2">THÔNG TIN THANH TOÁN</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-5 text-gray-100 font-medium">
          <ul className="space-y-4">
            <li>• Tài khoản ngân hàng của Công Ty TNHH VNTA Việt Nam</li>
            <li>• Số tài khoản: 0491000149974</li>
            <li>• Tại: Ngân hàng Vietcombank</li>
            <li>• Chi nhánh: Thăng Long, Hà Nội</li>
          </ul>
          <ul className="space-y-4">
            <li>• Tài khoản ngân hàng của CEO học viện VNTA Academy</li>
            <li>• Số tài khoản: 833013399999</li>
            <li>• Tại: Ngân hàng MB Bank</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto border-t-2  border-gray-400 mt-10 pt-4  text-gray-500">
     <span className="text-white text-left font-bold">Copyright © 2023 VNTA Academy. Design by WeSmartCorp</span>
      </div>
    </footer>
  );
};

export default FooterComponent;
