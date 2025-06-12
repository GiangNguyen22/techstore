import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import ProductModal from "../Cart/ProductModal";
import { addAProductCart } from "../../api/cart";

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

interface CardItemProps {
  product: Product;
  onClickAddToCart?: () => void;
}

const getCartItems = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const CardItem: React.FC<CardItemProps> = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSoldOut = product.stockQuantity === 0;
  const hasDiscount = product.discount > 0;
  const finalPrice = Math.round(product.price * (1 - product.discount / 100));
  const cartItems = getCartItems();

  const handleAddToCart = async (
    productVariantId: number,
    quantity: number
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      await addAProductCart({
        productVariantId,
        quantity,
      });
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setShowModal(false);
    } catch (error) {
      alert("Thêm vào giỏ hàng thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 const getQuantityInCart = (variantId: number): number => {
  // console.log("Cart Items from LS:", cartItems);

  const found = cartItems.find(
    (item: any) => item.productVariant && item.productVariant.id === variantId
  );
  return found ? found.quantity : 0;
};


  return (
    <>
      <div className="border rounded-md p-2 flex flex-col relative bg-white shadow-sm hover:shadow-md transition-all h-[370px]">
        <div className="h-[250px] flex items-center justify-center overflow-hidden border">
          <img
            src={product.thumbnail || product.image}
            alt={product.name}
            className="object-contain max-h-full"
          />
        </div>

        <p className="mt-2 text-sm font-semibold line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </p>

        <div className="text-sm font-bold mt-1">
          {isSoldOut ? (
            <span className="text-gray-400">Hết Hàng</span>
          ) : hasDiscount ? (
            <>
              <span className="text-red-600">
                {finalPrice.toLocaleString()}₫
              </span>{" "}
              <span className="line-through text-gray-400 text-xs">
                {product.price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="text-red-600">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 text-gray-500">
          <div title={isSoldOut ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}>
            <ShoppingBag
              className={`w-5 h-5 cursor-pointer ${
                isSoldOut
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:text-green-500"
              }`}
              onClick={() => {
                if (!isSoldOut) setShowModal(true);
              }}
            />
          </div>
          <div title="Yêu thích">
            <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          onConfirm={(variantId, quantity) =>
            handleAddToCart(variantId, quantity)
          }
          loading={loading}
          currentQuantityInCart={getQuantityInCart}
        />
      )}
    </>
  );
};

export default CardItem;
