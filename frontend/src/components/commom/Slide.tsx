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
const Slide = () => {
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
    <div
      className="relative bg-blue-50 pt-5 overflow-hidden max-w-full mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handlePrev}
        disabled={isBeginning}
        className={`rounded-full absolute left-0 top-1/2 z-10 -translate-y-1/2 ml-9 transform bg-white p-2 shadow-lg disabled:opacity-50 transition-all duration-300 ${
          isHovered ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
        }`}
      >
        <ChevronLeft size={34} className="text-red-400" />
      </button>
      <button
        onClick={handleNext}
        disabled={isEnd}
        className={`rounded-full absolute right-0 top-1/2 z-10 -translate-y-1/2 mr-9  transform bg-white p-2 shadow-lg disabled:opacity-50 transition-all duration-300 ${
          isHovered ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
        }`}
      >
        <ChevronRight size={34} className="text-red-400" />
      </button>

      {/* Swiper Slider */}
        <div className="max-w-[1200px] mx-auto">

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper: SwiperCore) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper: SwiperCore) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="">
            {/* thêm link ở đây */}
            <a href="/" title="SALE 148K">
              <picture>
                <img
                  className="max-w-[1200px] mx-auto  "
                  src="https://cdn.mykiot.vn/2024/12/17350337313590d59e2bbe6ca245b37d8902398137.png"
                  alt="SALE 148K"
                />
              </picture>
            </a>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div>
            <a href="/" title="New Arrivals">
              <picture>
                <img
                  className="max-w-[1200px] mx-auto  "
                  src="https://cdn.mykiot.vn/2025/01/173711152002366a75064aeb09e5ba7ebdd1e5ef59.jpg"
                  alt="Xmas Collection FW24"
                />
              </picture>
            </a>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div>
            <a href="/" title="New Arrivals">
              <picture>
                <img
                  className="max-w-[1200px] mx-auto  "
                  src="https://cdn.mykiot.vn/2024/12/1735033348a6ca58ceed498e9decc5006940de4256.jpg"
                  alt="Xmas Collection FW24"
                />
              </picture>
            </a>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <a href="/" title="New Arrivals">
              <picture>
                <img
                  className="max-w-[1200px] mx-auto  "
                  src="https://cdn.mykiot.vn/2025/01/1737019332b1c07ea4e4d8838efd13c1d5b65c3a55.jpg"
                  alt="Xmas Collection FW24"
                />
              </picture>
            </a>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <a href="/" title="New Arrivals">
              <picture>
                <img
                  className="max-w-[1200px] mx-auto  "
                  src="https://cdn.mykiot.vn/2025/01/17371096713619293e9bcd9effeaab6161f1e5f785.jpg"
                  alt="Xmas Collection FW24"
                />
              </picture>
            </a>
          </div>
        </SwiperSlide>

        {/* Thêm các slide khác tại đây */}
      </Swiper>
                </div>

    </div>
  );
};
export default Slide;
