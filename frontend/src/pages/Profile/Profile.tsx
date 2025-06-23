import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, UpdateProfileRequest, UserProfile } from "../../api/auth";
import Header from "../../components/commom/Header/Header";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <div className="flex justify-center items-center h-[80vh] text-gray-500 text-lg">Loading...</div>
      </>
    );

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-orange-400">Thông tin cá nhân</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-orange-400">Tên:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-md px-3 py-2 transition ${
                isEditing
                  ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-400">Ngày sinh:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-md px-3 py-2 transition ${
                isEditing
                  ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-400">Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full border rounded-md px-3 py-2 transition ${
                isEditing
                  ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-orange-400">Địa chỉ:</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className={`w-full border rounded-md px-3 py-2 resize-none transition ${
                isEditing
                  ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
            />
          </div>

          <div className="flex items-center space-x-3">
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded transition"
                >
                  Chỉnh sửa
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/user/orders")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition"
                >
                  Lịch sử mua hàng
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition disabled:opacity-70"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
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
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded transition"
                >
                  Hủy
                </button>
              </>
            )}
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 ${
              message.includes("thành công") ? "text-green-600" : "text-red-600"
            } font-semibold`}
          >
            {message}
          </p>
        )}
      </div>
    </>
  );
}
