import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "../../api/categories"; // API lấy category
import "swiper/css";
import "swiper/css/navigation";
interface SlideItem {
  title: string;
  desc: string;
  image: string;
  link?: string; 
}

const items = [
  {
    title: "MÀN HÌNH",
    desc: "Màn hình máy tính",
    image: "https://cdn.mykiot.vn/2021/11/e9f301e515930a3fb54d106868f653d65956bc619a6feabfe3b237477308eb6e.jpg",
  },
  {
    title: "ĐIỆN THOẠI",
    desc: "Điện thoại chính hãng",
    image: "https://cdn.mykiot.vn/2021/12/1639379077c4ee1adc869eda39f00b0cd79143eb54.jpg",
  },
  {
    title: "BÀN GAMING",
    desc: "Mô tả chi tiết của dịch vụ",
    image: "https://cdn.mykiot.vn/2021/12/1639379848c2f428742b1862f0d0063b9389cec318.jpg",
  },
  {
    title: "GHẾ GAMING",
    desc: "Mô tả chi tiết của dịch vụ",
    image: "https://cdn.mykiot.vn/2021/12/163938036612f9408b03135cb92096ffc8761da671.jpg",
  },
  {
    title: "PHỤ KIỆN",
    desc: "Bàn phím, chuột, tai nghe, quạt tản nhiệt,...",
    image: "https://cdn.mykiot.vn/2021/12/1639380863f8641302485d268a9faf705ee9a71624.jpg",
  },
  {
    title: "LAPTOP",
    desc: "Laptop học tập, gaming",
    image: "https://cdn.mykiot.vn/2021/11/184f643b2829c3e477dced94fcd274136e504feb66260556f810080c31ebdf7b.jpg",
  },
  {
    title: "PC",
    desc: "PC cấu hình cao",
    image: "https://cdn.mykiot.vn/2021/11/60e5c5970d8ae232b3db0654ab7e06bee62fd5a142f332f8cda2beb684b9cea2.jpg",
  },
  {
    title: "CAMERA",
    desc: "Camera an ninh",
    image: "https://cdn.mykiot.vn/2021/11/59356063262ff9e394b7267c2b9b840a8e42e3a8e32825c1ffe6e1ef141ba8f0.jpg",
  },
  {
    title: "THIẾT BỊ MẠNG",
    desc: "Router, switch, modem,...",
    image: "https://cdn.mykiot.vn/2021/11/695ab2ff9246f601e2fee2e6c73ffffb58b4da60357c59c2949228d352bf051a.jpg",
  },
];

const Slide3 = () => {
  const swiperRef = useRef<any>(null);
  const navigate = useNavigate();
const [itemsWithLink, setItemsWithLink] = React.useState<SlideItem[]>(items);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories(); // lấy danh sách category từ API
        // map items, tìm category trùng title (chú ý xử lý chữ hoa/thường, dấu)
        const updatedItems = items.map((item) => {
          const matchedCategory = categories.find(
            (cat: any) =>
              cat.name.toLowerCase().trim() === item.title.toLowerCase().trim()
          );
          if (matchedCategory) {
            return {
              ...item,
              link: `/category/${matchedCategory.id}`, // hoặc slug nếu có
            };
          }
          return item; // nếu ko tìm thấy thì giữ nguyên
        });
        setItemsWithLink(updatedItems);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className="relative rounded-xl p-10 mt-8 h-[300px] max-w-[1200px] mx-auto mb-10"
      style={{
        backgroundImage:
          'url("https://cdn.mykiot.vn/2021/08/212080a9551a47930d47c898ffc3aa7d0825bbbe0174fef9a91b083686850fa3.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Prev Button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-green-500 p-2 rounded-full text-white"
      >
        <ChevronLeft />
      </button>

      {/* Swiper */}
      <Swiper
        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
        modules={[Navigation, Autoplay]}
        slidesPerView={5}
        spaceBetween={20}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {itemsWithLink.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={() => {
                if (item.link) navigate(item.link);
              }}
              className={`flex flex-col items-center text-white text-center cursor-pointer ${
                !item.link ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-red-600 rounded-full p-4 mb-3">
                <img src={item.image} alt={item.title} className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Next Button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-green-500 p-2 rounded-full text-white"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Slide3;
