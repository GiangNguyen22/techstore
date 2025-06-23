import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Product, ProductVariant } from "../../types/Product.type";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../pages/Detail/NotificationProvider";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onConfirm?: (
    productVariantId: number,
    quantity: number,
    newThumbnailFile?: File
  ) => void;
  loading?: boolean;
  currentQuantityInCart: (variantId: number) => number;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onConfirm,
  loading,
  currentQuantityInCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showMessage } = useNotification();

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    } else {
      setSelectedVariant(null);
      setQuantity(1);
    }

    // reset ảnh preview khi product thay đổi
    setNewThumbnailFile(null);
    setPreviewUrl(null);
  }, [product]);

  const maxQuantity = selectedVariant?.stockQuantity ?? 0;

  const isSoldOut = maxQuantity === 0;

  const increase = () => {
    if (!isSoldOut && quantity < maxQuantity) {
      setQuantity((q) => q + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // tạo preview tạm thời
    }
  };
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const quantityInCart = currentQuantityInCart(selectedVariant.id);
    const totalQuantity = quantityInCart + quantity;
    if (totalQuantity > selectedVariant.stockQuantity) {
      showMessage(
        "Số lượng trong giỏ sẽ vượt quá số lượng tồn kho. Vui lòng giảm số lượng.",
        "success"
      );
      return;
    }
    // Gửi luôn file mới nếu có
    onConfirm?.(selectedVariant.id, quantity, newThumbnailFile ?? undefined);
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;

    // Chuyển sang trang /order với dữ liệu biến thể và số lượng đã chọn,
    // có thể truyền state hoặc query param để trang order lấy và hiện thông tin
    navigate("/order", {
      state: {
        productId: product.id,
        productVariantId: selectedVariant.id,
        quantity,
      },
    });
    onClose();
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const variantButtons =
    product.variants?.map((variant: ProductVariant) => (
      <button
        key={variant.id}
        onClick={() => handleSelectVariant(variant)}
        className={`px-3 py-1 border rounded mr-2 mb-2 ${
          selectedVariant?.id === variant.id
            ? "bg-black text-white"
            : "bg-white text-black"
        }`}
        disabled={variant.stockQuantity === 0}
        title={`Color: ${variant.color}, Size: ${variant.size}`}
      >
        {variant.color} / {variant.size}
        {variant.stockQuantity === 0 ? " (Hết hàng)" : ""}
      </button>
    )) || null;
  const BACKEND_URL = "http://localhost:8080";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-[#f8f8f8] rounded-xl p-6 md:p-8 w-full max-w-5xl relative shadow-xl text-gray-900">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Ảnh sản phẩm */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src={
                product.thumbnail
                  ? BACKEND_URL + product.thumbnail
                  : product.image
              }
              alt={product.name}
              className="object-contain h-[400px] w-full rounded-lg  "
            />
          </div>

          {/* Thông tin */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p
              className={`text-xl font-bold mb-4 ${
                isSoldOut ? "text-gray-400" : "text-gray-800"
              }`}
            >
              {isSoldOut ? "Hết hàng" : `${product.price.toLocaleString()}₫`}
            </p>

            {/* Biến thể */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1 font-medium">
                Chọn biến thể:
              </div>
              <div className="flex flex-wrap gap-2">{variantButtons}</div>
            </div>

            {/* Số lượng */}
            {!isSoldOut && selectedVariant && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm text-gray-600">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-md
                 px-3 py-1 bg-white">
                  <button
                    onClick={decrease}
                    className="text-gray-600 hover:text-black"
                    type="button"
                    aria-label="Giảm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 w-6 text-center">{quantity}</span>
                  <button
                    onClick={increase}
                    className="text-gray-600 hover:text-black"
                    type="button"
                    aria-label="Tăng"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  (Còn lại: {maxQuantity})
                </span>
              </div>
            )}

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* Nút cho vào giỏ hàng */}
              <Button
                onClick={handleAddToCart}
                disabled={isSoldOut || loading || !selectedVariant}
                className="w-full sm:w-auto  px-4 py-2 text-white rounded-md 
                 bg-[#cbb435] hover:bg-[#578fb7] transition"
              >
                {loading ? "Đang xử lý..." : "Cho vào giỏ hàng"}
              </Button>

              {/* Nút mua ngay */}
              <button
                type="button"
                onClick={handleBuyNow}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition text-white ${
                  isSoldOut || !selectedVariant
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#32a966] hover:bg-[#b4d43f]"
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
