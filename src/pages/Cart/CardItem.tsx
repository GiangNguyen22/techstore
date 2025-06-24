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
  const BACKEND_URL = "http://192.168.119.146:8080/";

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
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-4 flex flex-col transition-all duration-300 hover:-translate-y-1 group relative h-[400px] font-sans">
        <div
          className="h-[230px] flex items-center justify-center overflow-hidden rounded-xl cursor-pointer bg-gray-50"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={
              product.thumbnail
                ? BACKEND_URL + product.thumbnail
                : product.image
            }
            alt={product.name}
            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <p className="mt-3 text-base text-center font-semibold text-gray-800 tracking-tight line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </p>

        <div className="text-center mt-2">
          {isSoldOut ? (
            <span className="text-sm font-medium text-gray-400 italic">
              Hết hàng
            </span>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>

        <div className="flex justify-end items-center mt-auto pt-4">
          <div
            title={isSoldOut ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
            className={`p-2 rounded-full shadow ${
              isSoldOut
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:text-white cursor-pointer"
            } transition`}
            onClick={() => !isSoldOut && setShowModal(true)}
          >
            <ShoppingBag className="w-5 h-5" />
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
