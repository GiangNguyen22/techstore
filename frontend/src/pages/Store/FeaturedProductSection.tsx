import React, { useEffect, useState, useRef } from "react";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import ProductCard from "../Detail/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import Header from "../../components/commom/Header/Header";

const categoriesToShow = [
  "Camera",
  "Laptop",
  "TV&AV",
  "Gia Dụng",
  "Màn hình-Bộ nhớ",
  "Samsung Live",
];

const FeaturedProductSection = () => {
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, any[]>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperCore>();

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getCategories();
      const map: Record<string, number> = {};
      categories.forEach((cat: any) => {
        const match = categoriesToShow.find((title) =>
          cat.name.toLowerCase().includes(title.toLowerCase())
        );
        if (match) {
          map[match] = cat.id;
        }
      });
      setCategoryMap(map);

      const data: Record<string, any[]> = {};
      for (const title of categoriesToShow) {
        const catId = map[title];
        if (catId) {
          const prods = await getProducts(catId);
          data[title] = prods.slice(0, 5);
        }
      }
      setProductsByCategory(data);
    };

    fetchData();
  }, []);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index);
  };

  return (
    <>
    <div className="my-12 px-10 md:px-8 bg-white max-w-[1280px] mx-auto ">
      <h2 className="text-3xl font-bold mb-6 text-center">Sản Phẩm Nổi Bật</h2>

      {/* Tabs */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex justify-center gap-6 whitespace-nowrap px-2 border-b mb-6">
          {categoriesToShow.map((cat, index) => (
            <button
              key={cat}
              onClick={() => handleTabClick(index)}
              className={`relative pb-2 font-semibold text-lg transition duration-300 ${
                activeIndex === index
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {cat}
              <span
                className={`absolute left-1/2 bottom-0 h-[2px] bg-black transition-all 
                  duration-200 ${
                  activeIndex === index
                    ? "w-full -translate-x-1/2 scale-x-100"
                    : "w-0 -translate-x-1/2 scale-x-0"
                }`}
              ></span>
            </button>
          ))}
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        onSwiper={(swiper: any) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper: any) => setActiveIndex(swiper.activeIndex)}
        slidesPerView={1}
        spaceBetween={20}
      >
        {categoriesToShow.map((cat) => {
          const products = productsByCategory[cat] || [];
          return (
            <SwiperSlide key={cat}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Large product - chiếm 2/4 (50%) */}
                <div className="lg:col-span-2">
                  {products[0] && (
                    <div className="h-[620px]">
                      <ProductCard product={products[0]} size="large" />
                    </div>
                  )}
                </div>

                {/* 4 small products - chiếm 2/4 (chia 2x2) */}
                <div className="lg:col-span-2 grid grid-cols-2 grid-rows-2 gap-8 ">
                  {products.slice(1, 5).map((product) => (
                    <div key={product.id} className="h-[280px]">
                      <ProductCard product={product} size="small" />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
    </>
  );
};

export default FeaturedProductSection;
