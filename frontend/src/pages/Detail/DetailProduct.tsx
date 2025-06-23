import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products";
import { addAProductCart, getACart } from "../../api/cart";
import { useNotification } from "../../pages/Detail/NotificationProvider";
import { Product, ProductVariant } from "../../types/Product.type";
import FooterComponent from "../../components/commom/FooterComponent";
import Header from "../../components/commom/Header/Header";

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    try {
      const cart = await getACart();
      setCartItems(cart.items || []);
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: cart.items || [] })
      );
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    }
  };

  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariantId === variantId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        showMessage("Không tìm thấy sản phẩm", "error");
      }
    };

    fetchProduct();
    refreshCart();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const qtyInCart = currentQuantityInCart(selectedVariant.id);
    if (qtyInCart + quantity > selectedVariant.stockQuantity) {
      showMessage(`Hết hàng`, "error");
      return;
    }

    try {
      setLoading(true);
      await addAProductCart({ productVariantId: selectedVariant.id, quantity });
      await refreshCart();
      showMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, "success");
    } catch (error) {
      console.error(error);
      showMessage("Thêm vào giỏ hàng thất bại.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    if ( quantity > selectedVariant.stockQuantity) {
      showMessage(`Hết hàng`, "error");
      return;
    }
    navigate("/order", {
      state: {
        productId: product!.id,
        productVariantId: selectedVariant.id,
        quantity,
      },
    });
  };

  if (!product) return <div>Đang tải sản phẩm...</div>;

  return (
   <>
  <Header />
  <div className="max-w-6xl mx-auto px-6 py-10 bg-gradient-to-b from-orange-50 to-white">
    <div className="bg-white rounded-3xl shadow-2xl border border-orange-300 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Hình ảnh */}
      <div>
        <img
          src={
            product.thumbnail
              ? "http://localhost:8080" + product.thumbnail
              : product.image
          }
          alt={product.name}
          className="w-full h-[400px] object-contain rounded-2xl "
        />
      </div>

      {/* Thông tin chi tiết */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
            {product.name}
          </h1>
          <p className="text-red-600 text-3xl font-bold mb-6">
            {product.price.toLocaleString()}₫
          </p>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-orange-500 text-lg">
              Chọn biến thể:
            </label>
            <select
              value={selectedVariant?.id || ""}
              onChange={(e) => {
                const v = product.variants.find(
                  (v) => v.id === Number(e.target.value)
                );
                setSelectedVariant(v || null);
                setQuantity(1);
              }}
              className="border-2 border-orange-400 rounded-xl p-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.color} - Size {variant.size} (Còn {variant.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold text-orange-500 text-lg">
              Số lượng:
            </label>
            <input
              type="number"
              min={1}
              max={selectedVariant?.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border-2 border-orange-400 rounded-xl p-3 w-24 text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {selectedVariant && (
              <p className="mt-2 text-sm text-gray-600">
                Trong giỏ: {currentQuantityInCart(selectedVariant.id)} | Tồn kho:{" "}
                {selectedVariant.stockQuantity}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-5 mt-8">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || loading}
            className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 px-6 rounded-2xl font-semibold shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "🛒 Thêm vào giỏ"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!selectedVariant}
            className="bg-pink-500 hover:bg-pink-600 text-white text-lg py-3 px-6 rounded-2xl font-semibold shadow-md transition-all duration-300"
          >
            🚀 Mua ngay
          </button>
        </div>
      </div>
    </div>

    {/* Mô tả sản phẩm */}
    <div className="mt-10 bg-white rounded-3xl shadow-lg p-6 border border-orange-200">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">📝 Mô tả sản phẩm</h2>
      <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
        {product.description || "Không có mô tả cho sản phẩm này."}
      </p>
    </div>
  </div>
  <FooterComponent />
</>

  );
};

export default DetailProduct;
