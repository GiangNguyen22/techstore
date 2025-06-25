import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { Swiper as SwiperType } from "swiper";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products"; // Dùng API lấy tất cả sản phẩm

const slides = [
  {
    type: "video",
    videoSrc:
      "//images.samsung.com/is/content/samsung/assets/vn/ux3/home/Hero_KV_Home_PC_1920x1080.mp4",
    title2: "Galaxy S25 Ultra",
    description: "",
    buttonText: "Mua ngay",
    theme: "light",
  },
  {
    type: "image",
    image:
      "//images.samsung.com/is/image/samsung/assets/vn/2501/home/HOME_P1P2_MX-KV_1440x810_pc.jpg?$1440_810_JPG$",
    title2: "Galaxy S25 | S25+",
    description: "Ưu đãi x2 giá trị đổi điểm Rewards tối đa 1 triệu",
    buttonText: "Mua ngay",
    theme: "dark",
  },
  {
    type: "image",
    image:
      "//images.samsung.com/is/image/samsung/assets/vn/home/2025/HOME_Galaxy-A56_A36_MX-KV_content_743x418_pc.jpg?$1440_810_JPG$",
    title2: "Galaxy A56 | A36 5G",
    description: "Mới ra mắt. Ưu đãi 500k.",
    buttonText: "Mua ngay",
    theme: "dark",
  },
  {
    type: "image",
    image:
      "//images.samsung.com/is/image/samsung/assets/vn/2407/home/HOME_GBM-KV_WatchUltra_1440x810_pc.jpg?$1440_810_JPG$",
    title2: "Galaxy Watch Ultra",
    description:
      "Giảm thêm 2 triệu khi mua kèm Galaxy Z Fold6|Flip6 và Galaxy S24/S23 series",
    buttonText: "Mua ngay",
    theme: "light",
  },
  {
    type: "image",
    image:
      "//images.samsung.com/is/image/samsung/assets/vn/home/2024/HOME_TS10-Series_MX-KV_1440x810_pc.jpg?$1440_810_JPG$",
    title2: "Galaxy Tab S10 Series",
    description:
      "Thanh toán trước ưu đãi đến 1 triệu. Thu cũ đổi mới hỗ trợ đến 3 triệu",
    buttonText: "Mua ngay",
    theme: "dark",
  },
];

// Hàm tìm id theo tên sản phẩm
const normalize = (str: string) => 
  str
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ") // gộp các khoảng trắng
    .trim();

const getProductIdByName = (products: any[], name: string): number | undefined => {
  const normalizedName = normalize(name);
  const found = products.find(
    (p) => p.name && normalize(p.name) === normalizedName
  );
  return found ? found.id : undefined;
};

const SmartPhoneSlide = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy toàn bộ sản phẩm 1 lần khi mount component
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        console.log(data);
      } catch (e) {
        setProducts([]); // hoặc có thể show lỗi
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const swiperInstance = swiperRef.current;
    if (!swiperInstance) return;
    const updateTheme = () => setActiveIndex(swiperInstance.realIndex);
    swiperInstance.on("slideChange", updateTheme);
    return () => swiperInstance.off("slideChange", updateTheme);
    // eslint-disable-next-line
  }, []);
  const isDarkTheme = slides[activeIndex]?.theme === "light";

  // Handler khi click "Mua ngay"
  const handleBuyNow = (slide: typeof slides[0]) => {
    const id = getProductIdByName(products, slide.title2);
    if (id) {
      navigate(`/product/${id}`);
    } else {
      alert("Không tìm thấy sản phẩm!");
    }
  };

  return (
    <div className="relative mt-5 max-w-[1330px] mx-auto h-[800px] rounded-lg overflow-hidden shadow-lg">
      {/* Headline Titles */}
      <div className="absolute z-20 top-0 w-full text-center py-3">
        <div
          className={`${
            isDarkTheme ? "text-white" : "text-black"
          } text-4xl font-bold mb-2`}
        >
          Di Động
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`relative group px-3 py-1 text-sm font-semibold transition-opacity duration-300 ${
                isDarkTheme ? "text-white" : "text-black"
              } ${activeIndex !== index ? "opacity-70" : "opacity-100"}`}
            >
              <span>{slide.title2}</span>
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] rounded-full transition-all duration-500 ${
                  isDarkTheme ? "bg-white" : "bg-black"
                } ${
                  activeIndex === index
                    ? "w-[120px] -translate-x-1/2 opacity-100"
                    : "w-0 -translate-x-1/2 opacity-0 group-hover:opacity-30"
                }`}
              ></span>
            </button>
          ))}
        </div>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.type === "video" ? (
              <video
                src={slide.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title2}
                className="w-full h-full object-cover"
              />
            )}

            <div
              className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-20 ${
                slide.theme === "light" ? "text-white" : "text-black"
              }`}
            >
              <p className="text-4xl font-bold mb-2 max-w-xl mx-auto">
                {slide.title2}
              </p>
              <p className="text-lg font-medium mb-6 max-w-xl mx-auto">
                {slide.description}
              </p>
              <button
                onClick={() => handleBuyNow(slide)}
                className={`px-6 py-3 rounded-full transition font-medium ${
                  slide.theme === "light"
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                disabled={products.length === 0}
              >
                {slide.buttonText}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SmartPhoneSlide;