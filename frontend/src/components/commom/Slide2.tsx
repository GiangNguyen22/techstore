import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import CardItem from "../../pages/Cart/CardItem";
import ProductModal from "../../pages/Cart/ProductModal";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { getACart } from "../../api/cart";
import { useNotification } from "../../pages/Detail/NotificationProvider";
import { Product } from "../../types/Product.type";

const Slide2 = () => {
  const swiperRef = useRef<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { showMessage } = useNotification();

  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariantId === variantId);
    return item ? item.quantity : 0;
  };

  const refreshCart = async () => {
    try {
      const cart = await getACart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    const fetchKeyboardProducts = async () => {
      try {
        const categories = await getCategories();
        const keyboardCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "keyboard"
        );

        if (keyboardCategory) {
          const productList = await getProducts(keyboardCategory.id);
          setProducts(productList.slice(0, 10));
        } else {
          console.warn("Không tìm thấy category tên 'Keyboard'");
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm Keyboard:", error);
      }
    };

    fetchKeyboardProducts();
  }, []);

  return (
    <div className="relative max-w-[1400px] mx-auto py-6">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        autoplay={{
          delay: 3000,
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
              refreshCart={refreshCart}
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
          onConfirm={async (variantId, quantity) => {
            await refreshCart();
            setSelectedProduct(null);
            showMessage(
              `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
              "success"
            );
          }}
          currentQuantityInCart={currentQuantityInCart}
        />
      )}
    </div>
  );
};

export default Slide2;
