import Header from "../../components/commom/Header/Header";
import FooterComponent from "../../components/commom/FooterComponent";
import Slide from "../../components/commom/Slide";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/auth";
import { setAuthData } from "../../reducer/auth";
import { RootState } from "../../stores/store";
import HeaderTop from "../../components/commom/Header/component/HeaderTop";
import Slide3 from "../../components/commom/Slide3";
import Slide2 from "../../components/commom/Slide2";
import Slide4 from "../../components/commom/Slide4";
import LaptopProductList from "./LaptopProductList";
import UserChatPopup from "../../components/Chat/UserChatPopUp";
import AdminChat from "../../components/Admin/AdminChat";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || ""
  );
  const [username, setUsername] = useState<string | null>(null);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (!res) return;
        // console.log("📦 API profile result:", res);

        setUsername(res.name);
        dispatch(
          setAuthData({
            username: res.name,
            token: token,
            isAdmin:
              res.role?.name === "ROLE_ADMIN" ||
              res.role?.authority === "ROLE_ADMIN",
          })
        );
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };

    fetchProfile();
  }, [dispatch, token]);
  // console.log("✅ isAdmin:", isAdmin);
  // console.log("✅ token:", token);
  // console.log("✅ username:", username);

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-100 w-full min-h-screen overflow-hidden">
      <Header />
      <Slide />
      <Slide2 />
      <Slide3 />
      <Slide4 />
      <LaptopProductList />
      {token && !isAdmin && username && (
        <UserChatPopup authToken={token} username={username} />
      )}
      {/* {token && isAdmin && <AdminChat />} */}
        {token && isAdmin && (
        <button
          onClick={() => navigate("/admin/chat")}
          className="fixed top-1/2 right-5 -translate-y-1/2 bg-blue-600 text-white text-xl px-6 py-4 rounded-lg shadow-lg z-50 hover:bg-blue-700 transition"
        >
          📨 Message
        </button>
      )}
      <FooterComponent />
    </div>
  );
};

export default HomePage;
