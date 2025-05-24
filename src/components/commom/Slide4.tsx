import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import CardItem from "../../pages/Cart/CardItem";
import ProductModal from "../../pages/Cart/ProductModal";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  discount: number;
  image: string;
  thumbnail: string;
  type: string;
  companyName: string;
  quantity: number;
  categoryId: number;
  position: { top: string; left: string };
  imageIndex: number;
}

const Slide4 = () => {
  const swiperRef = useRef<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCameraProducts = async () => {
      try {
        const categories = await getCategories();
        const cameraCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "camera"
        );

        if (cameraCategory) {
          const productList = await getProducts(cameraCategory.id);
          setProducts(productList);
        } else {
          console.warn("Không tìm thấy category tên 'Camera'");
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm Camera:", error);
      }
    };

    fetchCameraProducts();
  }, []);

  return (
    <div className="relative max-w-[1200px] mx-auto py-6">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
        }}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <CardItem
              product={product}
              onClickAddToCart={() => setSelectedProduct(product)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-swiper-pagination flex justify-center mt-4" />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={() => {}}
        />
      )}
    </div>
  );
};

export default Slide4;
