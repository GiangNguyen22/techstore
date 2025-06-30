import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  UpdateProfileRequest,
  UserProfile,
} from "../../api/auth";
import Header from "../../components/commom/Header/Header";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores/store";
import { useDispatch, useSelector } from "react-redux";
import UserChatPopup from "../../components/Chat/UserChatPopUp";
import HeaderTop from "../../components/commom/Header/component/HeaderTop";

export default function Profile() {
  const navigate = useNavigate();
  const { token, isAdmin, username } = useSelector(
    (state: RootState) => state.auth
  );

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UpdateProfileRequest>({
    name: "",
    dateOfBirth: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setProfile(userData);
          setForm({
            name: userData.name,
            dateOfBirth: userData.dateOfBirth,
            phone: userData.phone,
            address: userData.address,
          });
        } else {
          console.warn("Không có dữ liệu người dùng");
        }
      } catch (error) {
        console.error("Lấy profile thất bại", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateUserProfile(form);
      setMessage("Cập nhật thành công!");
      setIsEditing(false);
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
    } catch (error) {
      setMessage("Cập nhật thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 text-center mt-4 font-medium">Đang tải...</p>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Chào mừng, {profile.name || username}!
            </h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
          </div>

          {/* Admin Controls */}
          {token && isAdmin && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-lg">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">👑</span>
                Công cụ Quản trị
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/admin/chat")}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-white/30"
                >
                  <span className="text-2xl">📨</span>
                  <span>Message</span>
                </button>

                <button
                  onClick={() =>
                   navigate("/dashboard_layout")
                  }
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-white/30"
                >
                  <span className="text-2xl">🛠️</span>
                  <span>Manage Admin</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">👤</span>
                Thông tin cá nhân
              </h2>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <span className="text-orange-500 mr-2">👤</span>
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                      }`}
                      required
                    />
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <span className="text-orange-500 mr-2">🎂</span>
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-300 ${
                        isEditing
                          ? "border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none bg-white"
                          : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="text-orange-500 mr-2">📱</span>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all duration-300 ${
                      isEditing
                        ? "border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none bg-white"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                    }`}
                  />
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="text-orange-500 mr-2">🏠</span>
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full border-2 rounded-xl px-4 py-3 resize-none transition-all duration-300 ${
                      isEditing
                        ? "border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none bg-white"
                        : "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600"
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                  {!isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <span>✏️</span>
                        Chỉnh sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/user/orders")}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <span>🛍️</span>
                        Lịch sử mua hàng
                      </button>
                    </>
                  )
                 } 
                 {isEditing && (
                    <>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            Lưu thay đổi
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setForm({
                            name: profile.name,
                            dateOfBirth: profile.dateOfBirth,
                            phone: profile.phone,
                            address: profile.address,
                          });
                          setMessage("");
                        }}
                        className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <span>❌</span>
                        Hủy
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* Success/Error Message */}
              {message && (
                <div className={`mt-6 p-4 rounded-xl border-l-4 ${
                  message.includes("thành công") 
                    ? "bg-green-50 border-green-500 text-green-700" 
                    : "bg-red-50 border-red-500 text-red-700"
                }`}>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">
                      {message.includes("thành công") ? "✅" : "❌"}
                    </span>
                    <p className="font-semibold">{message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}