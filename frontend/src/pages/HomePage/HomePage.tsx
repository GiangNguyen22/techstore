import Header from "../../components/commom/Header/Header";
import FooterComponent from "../../components/commom/FooterComponent";
import Slide from "../../components/commom/Slide";

import Slide3 from "../../components/commom/Slide3";
import Slide2 from "../../components/commom/Slide2";
import Slide4 from "../../components/commom/Slide4";
import LaptopProductList from "./LaptopProductList";
import UserChatPopup from "../../components/Chat/UserChatPopUp";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/users";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../reducer/auth";
import { RootState } from "../../stores/store";
import AdminChat from "../../components/Admin/AdminChat";
const HomePage = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || '');
   const [username, setUsername] = useState<string | null>(null);
   const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
   
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(); // gọi API
        setUsername(res.name); // hoặc res.data.username tùy định dạng
       dispatch(setAuthData({
        username: res.name,
        token: token,
        isAdmin: res.role?.authority === 'ADMIN'
      }));
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };

    fetchProfile();
  }, [dispatch, token]);

  return (
    <div className="bg-white w-full overflow-hidden">
      {/* <HeaderTop /> */}
      <Header />
      <Slide />
      <Slide2 />
      <Slide3 />
      <Slide4/>
      <LaptopProductList/>
      {token && !isAdmin && <UserChatPopup authToken={token} username={username}/>}
      {token && isAdmin && <AdminChat/>}
      <FooterComponent />
    </div>
  );
};

export default HomePage;
