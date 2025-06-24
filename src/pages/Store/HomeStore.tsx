import React, { SetStateAction, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import { Swiper as SwiperCore, Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import ReusableCarousel from "./ReusableCarousel";
import FeaturedProductSection from "./FeaturedProductSection";
import Header from "../../components/commom/Header/Header";
import SmartPhoneSlide from "./SmartPhoneSlide";
import FooterComponent from "../../components/commom/FooterComponent";
import AccessoriesBanner from "./AccessoriesBanner";
const HomeStore = () => {
  return (
  <div className="bg-white w-full h-auto overflow-hidden">
      <Header/>
      <ReusableCarousel />
      <FeaturedProductSection/>
      <SmartPhoneSlide/>
      <AccessoriesBanner/>
      <FooterComponent/>
      
    </div>
  );
};
export default HomeStore;
