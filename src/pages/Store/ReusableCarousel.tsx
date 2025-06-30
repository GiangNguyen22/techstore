import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    image:
      "https://images.samsung.com/is/image/samsung/assets/vn/home/2025/EarlyOrderPC1440x640NT.jpg?imwidth=1366",
    title: "",
    title2: "Samsung Bespoke AI",

    description: "Khởi nhịp Sống mới với ưu đãi đặc quyền",
    buttonText: "Mua ngay",
    progressColor: "bg-white",
    isVideo: false,
  },
  {
    image:
      "https://images.samsung.com/is/image/samsung/assets/vn/home/2025/KV_1440x640_pc_LTR-noText.jpg?imwidth=1366",
    backgroundColor: "bg-blue-900",
    title: "Galaxy Ring",
    title2: "Galaxy Ring",

    description: "Ưu đãi 1 triệu khi mua cùng Galaxy S25 Edge",
    buttonText: "Mua ngay",
    progressColor: "bg-black",
    isVideo: false,
  },
  {
    image:
      "//images.samsung.com/is/image/samsung/assets/vn/home/2025/HOME_GalaxyS25Edge_Main-KV_1440x640_pc.jpg?imwidth=1366",
    title: "",
    title2: "Galaxy S25 Edge",

    description: "Sở hữu phiên bản 512GB với giá 256GB ngay!",
    buttonText: "Mua ngay",
    progressColor: "bg-black",
    isVideo: false,
  },
  {
    image:
      "//images.samsung.com/is/content/samsung/assets/vn/home/2025/2025_VD_Vision_AI_Launch_Animated_KV_Dotcom_PC.mp4",
    title: "Đỉnh cao toàn năng<br /> Thăng hạng toàn diện",
    title2: "Samsung AI TV",

    description:
      "Mua Samsung AI TV mới, nhận ưu đãi lên đến 27 triệu<br /> Săn thêm e-Voucher giảm giá 3 Triệu chỉ với 100k",
    buttonText: "Mua ngay",
    progressColor: "bg-black",
    isVideo: true,
  },
  {
    image:
      "//images.samsung.com/is/content/samsung/assets/vn/home/2025/M9_Launching_KV_PC_Notext.mp4",
    title: "Màn hình thông minh <br /> AI 2025 đã xuất hiện",
    title2: "Smart AI Monitor Pre-Order",

    description:
      "Làm việc, chơi game, giải trí thật phong cách với Samsung Vision AI",
    buttonText: "Mua ngay",
    progressColor: "bg-black",
    isVideo: true,
  },
];

const ReusableCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 7000;
    const updateInterval = 50;
    const step = (updateInterval / intervalTime) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
          setProgress(0);
          setScale(1);
          return 0;
        }
        setScale(1 + prev / 500);
        return prev + step;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="relative mt-5 max-w-[1330px] mx-auto h-[620px] rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div
        className={`w-full h-full transition-transform duration-500 ${
          slides[currentIndex].backgroundColor || ""
        }`}
      >
        {slides[currentIndex].isVideo ? (
          <video
            src={slides[currentIndex].image}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ objectFit: "cover", maxWidth: "100%", height: "100%" }}
          />
        ) : (
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
            style={{ objectFit: "cover", maxWidth: "100%", height: "100%" }}
          />
        )}
      </div>

      {/* Text overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start justify-center text-black px-6 lg:pl-24 z-10 ">
        <h1
          className="text-4xl font-bold "
          dangerouslySetInnerHTML={{ __html: slides[currentIndex].title }}
        ></h1>
        <p
          className="mt-28 mb-5 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: slides[currentIndex].description }}
        ></p>
        <button
          className={`mt-0 bg-black  text-white px-6 py-2 rounded-3xl 
        font-semibold hover:bg-white hover:text-black transition  
        ${
          slides[currentIndex].progressColor === "bg-black"
            ? "border border-black"
            : "border border-white"
        }
`}
        >
          {slides[currentIndex].buttonText}
        </button>
      </div>

      {/* Chevron controls */}
      <button
        onClick={() => {
          setCurrentIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
          );
          setProgress(0);
          setScale(1);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40  text-white p-3 rounded-full hover:bg-black/70 z-20"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
          setProgress(0);
          setScale(1);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 z-20"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Titles + Progress */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-8 z-10">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index);
              setProgress(0);
              setScale(1);
            }}
          >
            <span
              className={`absolute bottom-full mb-1 text-sm font-semibold transition-all
                 duration-300 opacity-0 group-hover:opacity-100
    ${
      slides[currentIndex].progressColor === "bg-white"
        ? "text-white"
        : "text-black"
    }`}
            >
              {slide.title2}
            </span>

            <div className="w-36 h-[2px] bg-gray-500 mb-1 relative overflow-hidden">
              {index === currentIndex && (
                <div
                  className={`h-full absolute top-0 left-0 transition-all duration-100 ${slides[index].progressColor}`}
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReusableCarousel;
