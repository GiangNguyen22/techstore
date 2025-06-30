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
import { useNavigate } from "react-router-dom";
import SmartPhoneProductList from "./SmartPhoneProductList";
import Accessories from "./Accessories";
import GamingTable from "./GamingTable";
import SupportSections from "./SupportSections";
import MonitorProductList from "./MonitorProductList";

const HomePage = () => {
  const navigate = useNavigate();
const { token, isAdmin, username } = useSelector((state: RootState) => state.auth);

  // console.log("✅ isAdmin:", isAdmin);
  // console.log("✅ token:", token);
  // console.log("✅ username:", username);

  return (
    <div className="bg-white w-full min-h-screen overflow-hidden">
      <Header />
      <Slide />
      <Slide2 />
      <Slide3 />
      <Slide4 />
      <LaptopProductList />
      <SmartPhoneProductList/>
      <Accessories/>
      <GamingTable/> 
      <MonitorProductList/>
      <SupportSections/>
     
      {token && !isAdmin && username && (
        <UserChatPopup authToken={token} username={username} />
      )}       
      <FooterComponent />
    </div>
  );
};

export default HomePage;
