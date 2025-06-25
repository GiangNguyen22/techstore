import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import ProductModal from "../Cart/ProductModal";
import { addAProductCart, getACart } from "../../api/cart";
import { useNotification } from "../../pages/Detail/NotificationProvider";
import { Product } from "../../types/Product.type";
import { useNavigate } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
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
      <div
        className="flex flex-col bg-white rounded-2xl shadow-sm 
        hover:shadow-xl hover:-translate-y-2 duration-300  h-[370px] 
        group relative font-sans transition-all border p-3"
      >
        {/* Image */}
        <div
          className="w-full h-[200px] rounded-xl overflow-hidden 
  bg-gray-50 border mb-3 flex items-center justify-center
  transition-all duration-300   cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={
              product.thumbnail
                ? BACKEND_URL + product.thumbnail
                : product.image
            }
            alt={product.name}
            className="block w-full h-full object-cover
 transition-transform duration-300"
          />
        </div>

        {/* Product Name */}
        <p
          className="text-base text-left font-bold text-black tracking-tight line-clamp-2
          min-h-[33px] 
          transition-colors duration-300 group-hover:text-orange-600"
        >
          {product.name}
        </p>

        {/* Price or Sold out */}
        <div className="text-left min-h-[20px] mb-4">
          {isSoldOut ? (
            <span className="text-sm font-medium text-gray-400 italic">
              Hết hàng
            </span>
          ) : (
            <span
              className="text-lg font-semibold 
             group-hover:text-orange-600 transition-colors duration-300"
            >
              {product.price.toLocaleString()} VND
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <div className="flex justify-center items-center ">
          <button
            type="button"
            title={isSoldOut ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}
            className={`p-2 rounded-full shadow transition 
              ${
                isSoldOut
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
              }`}
            disabled={isSoldOut}
            onClick={() => !isSoldOut && setShowModal(true)}
            style={{ transition: "transform 0.2s" }}
          >
            <FaShoppingBag className="w-5 h-5" />
          </button>
        </div>
        {/* Hiệu ứng ripple cho nút nếu thích: */}
        <style>
          {`
            button:active { transform: scale(0.92); }
          `}
        </style>
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
