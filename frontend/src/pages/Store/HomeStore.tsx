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
const HomeStore = () => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
  <div className="bg-white w-full h-auto overflow-hidden">
      <Header/>
      <ReusableCarousel />
      <FeaturedProductSection/>
      <SmartPhoneSlide/>
      <FooterComponent/>
    </div>
  );
};
export default HomeStore;
