import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaInfoCircle,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa";

const Register = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 h-[500px]">
      <div className="container mx-auto flex justify-between items-center gap-16">
        {/* Thông tin liên hệ */}
        <div className="w-1/2 mb-28">
          <h2 className="text-3xl font-bold text-white">ĐĂNG KÝ HỌC THỬ</h2>
          <p className="mt-4 text-gray-200 leading-relaxed">
            Đăng ký ngay hôm nay bạn sẽ được học từ các HLV chuyên nghiệp có
            kinh nghiệm và hướng dẫn qua các bài tập luyện tập thiết thực.
          </p>
          <div className="mt-6 space-y-4">
            <p className="flex items-center gap-3 text-white">
              <FaMapMarkerAlt className="text-white" /> 35 Trần Quý Kiên,
              Dịch Vọng, Cầu Giấy, Hà Nội
            </p>
            <p className="flex items-center gap-3 text-white">
              <FaMapMarkerAlt className="text-white" /> 147 Nguyễn Đức Thuận,
              Phường 13, Quận Tân Bình, TPHCM
            </p>
            <p className="flex items-center gap-3 text-white">
              <FaPhoneAlt className="text-white" /> 0931 81 3333
            </p>
            <p className="flex items-center gap-3 text-white">
              <FaEnvelope className="text-white" /> info@vntaacademy.com
            </p>
          </div>
        </div>

        {/* Form đăng ký - Canh giữa */}
        <div className="w-1/2 flex flex-col items-center">
          <div className="w-3/4 ">
            <div className="grid grid-cols-2 gap-6 ">
              {[
                { icon: <FaUser />, placeholder: "Họ và Tên" },
                { icon: <FaEnvelope />, placeholder: "Email" },
                { icon: <FaPhoneAlt />, placeholder: "Số điện thoại" },
                { icon: <FaInfoCircle />, placeholder: "Tiêu đề" },
              ].map((field, index) => (
                <div key={index} className="group relative space-y-2 mt-5">
                  <div className="flex items-center gap-3 py-3">
                    <span className="text-white">{field.icon}</span>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="bg-transparent outline-none text-white w-full"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-600 group-hover:bg-white transition-all duration-300"></div>
                </div>
              ))}
            </div>

            {/* Ô nhập nội dung */}
            <div className="group relative mt-6 space-y-2">
              <div className="flex items-center gap-3 py-3">
                <FaEdit className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập nội dung ở đây!"
                  className="bg-transparent outline-none text-white w-full"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 top-20 bg-gray-600 group-hover:bg-white transition-all duration-300"></div>
            </div>

            {/* Nút đăng ký */}
            <div className="ml-40">
              <button className="mt-28 bg-orange-500 flex items-center gap-3 px-8 py-4  font-semibold hover:bg-orange-600 transition">
                <FaPaperPlane className="text-white" />
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Register;
