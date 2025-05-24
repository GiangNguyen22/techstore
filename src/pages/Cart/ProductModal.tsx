import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Product, ProductVariant } from "../../types/Product.type";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onConfirm?: (productVariantId: number, quantity: number) => void;
  loading?: boolean;
  currentQuantityInCart?: (variantId: number) => number;
}


const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onConfirm,
  loading,
    currentQuantityInCart ,

}) => {
  // Lưu biến thể đang được chọn
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
const currentQty =
  selectedVariant?.id && currentQuantityInCart
    ? currentQuantityInCart(selectedVariant.id)
    : 0;

const maxQuantity =
  (selectedVariant?.stockQuantity ?? 0) - currentQty;

  // Mặc định chọn variant đầu tiên (nếu có)
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product.variants]);

  const isSoldOut = selectedVariant?.stockQuantity === 0;

  const increase = () => {
    if (!isSoldOut && quantity < maxQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrease = () => {
    if (!isSoldOut) {
      setQuantity((q) => (q > 1 ? q - 1 : 1));
    }
  };

  // Hàm chọn biến thể
  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // reset số lượng khi đổi biến thể
  };

  // UI chọn màu hoặc size
  // Bạn có thể tùy biến UI theo nhu cầu nhé
  const variantButtons =
    product.variants?.map((variant: any) => (
      <button
        key={variant.id}
        onClick={() => handleSelectVariant(variant)}
        className={`px-3 py-1 border rounded mr-2 mb-2 ${
          selectedVariant?.id === variant.id
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        }`}
        disabled={variant.stockQuantity === 0}
        title={`Color: ${variant.color}, Size: ${variant.size}`}
      >
        {variant.color} / {variant.size}
        {variant.stockQuantity === 0 ? " (Hết hàng)" : ""}
      </button>
    )) || null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex gap-6 flex-col md:flex-row">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full md:w-1/2 object-contain max-h-[400px]"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-red-600 font-bold text-xl">
              {isSoldOut ? "Hết hàng" : `${product.price.toLocaleString()}₫`}
            </p>

            <div className="mb-4">
              <div className="mb-2 font-medium">Chọn biến thể:</div>
              <div className="flex flex-wrap">{variantButtons}</div>
            </div>

            {!isSoldOut && selectedVariant && (
              <div className="mt-4 flex items-center gap-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded px-2 py-1">
                  <button
                    onClick={decrease}
                    className="text-gray-600 hover:text-black"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 w-6 text-center">{quantity}</span>
                  <button
                    onClick={increase}
                    className="text-gray-600 hover:text-black"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
               <span className="text-xs text-gray-500">
          (Còn lại: {maxQuantity > 0 ? maxQuantity : 0})
        </span>
              </div>
            )}

            <div className="flex gap-7 mt-8">
              <Button
                onClick={() =>
                  selectedVariant && onConfirm?.(selectedVariant.id, quantity)
                }
                disabled={isSoldOut || loading || !selectedVariant}
              >
                {loading ? "Đang xử lý..." : "Cho vào giỏ hàng"}
              </Button>

              <button
                className={`px-4 py-2 text-white rounded ${
                  isSoldOut || !selectedVariant
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                }`}
                disabled={isSoldOut || !selectedVariant}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
