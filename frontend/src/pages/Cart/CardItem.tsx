import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import ProductModal from "../Cart/ProductModal";
import { addAProductCart, getACart } from "../../api/cart";
import { useNotification } from "../../pages/Detail/NotificationProvider";
import { Product } from "../../types/Product.type";
import { useNavigate } from "react-router-dom";

interface CardItemProps {
  product: Product;
  currentQuantityInCart: (variantId: number) => number;
  refreshCart?: () => Promise<void>;
  onClickAddToCart?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  product,
  currentQuantityInCart,
  refreshCart,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useNotification();
  const navigate = useNavigate();

  const isSoldOut = product.stockQuantity === 0;
  const BACKEND_URL = "http://localhost:8080";

  const handleAddToCart = async (
    productVariantId: number,
    quantity: number
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentQtyInCart = currentQuantityInCart(productVariantId);
      const variant = product.variants?.find((v) => v.id === productVariantId);
      const stockQty = variant?.stockQuantity ?? 0;

      if (currentQtyInCart + quantity > stockQty) {
        showMessage(
          `Số lượng trong giỏ hàng đã đạt tối đa cho biến thể này. (Tối đa: ${stockQty})`,
          "error"
        );
        setLoading(false);
        return;
      }

      await addAProductCart({ productVariantId, quantity });
      setShowModal(false);
      await refreshCart?.();

      // Dispatch sự kiện cập nhật giỏ hàng
      try {
        const updatedCart = await getACart();
        const updatedItems = updatedCart.items || [];
        window.dispatchEvent(
          new CustomEvent("cart-updated", { detail: updatedItems })
        );
      } catch (e) {
        console.warn("Không thể gửi cart-updated:", e);
      }

      showMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, "success");
    } catch (error) {
      console.error(error);
      showMessage("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-lg p-3 flex flex-col transition-all duration-300 
      hover:-translate-y-2 group relative h-[390px]">
        <div
          className="h-[230px] flex items-center justify-center overflow-hidden 
          rounded-xl cursor-pointer  "
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={
              product.thumbnail
                ? BACKEND_URL + product.thumbnail
                : product.image
            }
            alt={product.name}
            className="object-contain  max-h-full transition-transform 
            duration-300 group-hover:scale-105"
          />
        </div>

        <p className="mt-3 text-xl text-center font-semibold text-black line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </p>

        <div className="text-base font-bold mt-2">
          {isSoldOut ? (
            <span className="text-gray-400">Hết Hàng</span>
          ) : (
            <span className="text-black font-semibold text-lg">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>

        <div className="flex justify-end items-center mt-3">
          <div
            title={isSoldOut ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
            className={`p-2 rounded-full ${
              isSoldOut
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700 cursor-pointer"
            } transition`}
            onClick={() => !isSoldOut && setShowModal(true)}
          >
            <ShoppingBag className="w-5 h-5 " />
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          onConfirm={handleAddToCart}
          loading={loading}
          currentQuantityInCart={currentQuantityInCart}
        />
      )}
    </>
  );
};

export default CardItem;
