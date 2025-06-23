import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import CardItem from "../../pages/Cart/CardItem";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { getACart } from "../../api/cart";
import { Product } from "../../types/Product.type";

const Slide4 = () => {
  const swiperRef = useRef<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Lấy số lượng từng biến thể trong giỏ hàng
  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariantId === variantId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getACart();
        setCartItems(cart.items || []);
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchCameraProducts = async () => {
      try {
        const categories = await getCategories();
        const cameraCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "camera"
        );
        if (cameraCategory) {
          const productList = await getProducts(cameraCategory.id);
          setProducts(productList.slice(0, 10));
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
              currentQuantityInCart={currentQuantityInCart}
              refreshCart={async () => {
                const cart = await getACart();
                setCartItems(cart.items || []);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-swiper-pagination flex justify-center mt-4" />
    </div>
  );
};

export default Slide4;
