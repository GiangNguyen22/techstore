import React, { useEffect, useState } from "react";
import CartItem from "../Cart/CartItem";
import Header from "../../components/commom/Header/Header";
import { getACart, updateCart, deleteCart } from "../../api/cart";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../pages/Detail/NotificationProvider"; // đường dẫn ví dụ

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { showMessage } = useNotification();

  // Chuyển item từ API về định dạng hiển thị trong cart
  const mapApiItemToCartItem = (apiItem: any) => ({
    id: apiItem.id, // cartItemId
    productId: apiItem.productId, // ✅ thêm dòng này
    productVariantId: apiItem.productVariantId,
    name: apiItem.productName || "Tên sản phẩm",
    image: apiItem.thumbnail || "/placeholder.png",
    productPrice: Number(apiItem.unitPrice || 0),
    quantity: apiItem.quantity || 1,
    variation: `Màu: ${apiItem.color || "N/A"}, Size: ${apiItem.size || "N/A"}`,
    originalPrice: Number(apiItem.originalPrice || 0),
    stockQuantity: Number(apiItem.stockQuantity ?? 100000),
  });

  const currentQuantityInCart = (variantId: number): number => {
    return cartItems
      .filter((item) => item.productVariantId === variantId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const loadCart = async () => {
    try {
      const data = await getACart();
      if (Array.isArray(data.items)) {
        const mappedItems = data.items.map(mapApiItemToCartItem);
        setCartItems(mappedItems);
        window.dispatchEvent(
          new CustomEvent("cart-updated", { detail: mappedItems })
        );
      } else {
        setCartItems([]);
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }));
      }
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      setCartItems([]);
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }));
    }
  };

  const updateQuantity = async (index: number, delta: number) => {
    const item = cartItems[index];
    const currentQty = item.quantity;
    const maxQty = item.stockQuantity;

    const newQty = Math.max(1, Math.min(currentQty + delta, maxQty));
    if (newQty === currentQty) return;

    try {
      await updateCart(item.id, newQty);
      const updatedItems = [...cartItems];
      updatedItems[index].quantity = newQty;
      setCartItems(updatedItems);

      // Thêm dòng này để phát event cập nhật giỏ hàng
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: updatedItems })
      );
    } catch (error: any) {
      console.error(
        "Lỗi cập nhật số lượng:",
        error.response?.data || error.message
      );
    }
  };
  const total = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
    
  );
console.log(cartItems);
  const removeItem = async (index: number) => {
    const item = cartItems[index];
    try {
      await deleteCart(item.id);
      const updated = cartItems.filter((_, i) => i !== index);
      setCartItems(updated);

      // Thêm dòng này để phát event cập nhật giỏ hàng
      window.dispatchEvent(
        new CustomEvent("cart-updated", { detail: updated })
      );
    } catch (error: any) {
      console.error("Lỗi xóa sản phẩm:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const BACKEND_URL = "http://localhost:8080";

  const handleBuyNow = () => {
    const invalidItems = cartItems.filter(
      (item) => item.quantity > item.stockQuantity
    );

    if (invalidItems.length > 0) {
      showMessage(
        `Sản phẩm "${invalidItems[0].name}" chỉ còn ${invalidItems[0].stockQuantity} sản phẩm trong kho. Vui lòng điều chỉnh lại số lượng.`,
        "error"
      );
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
    }));

    navigate("/order", { state: orderItems });
  };

 return (
  <>
    <Header />
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">🛒 Giỏ hàng của bạn</h2>

        <div className="grid grid-cols-12 font-semibold text-gray-600 border-b pb-2 text-sm">
          <div className="col-span-5">Sản Phẩm</div>
          <div className="col-span-2 text-center">Đơn Giá</div>
          <div className="col-span-2 text-center">Số Lượng</div>
          <div className="col-span-2 text-center">Số Tiền</div>
          <div className="col-span-1 text-center">Xóa</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Giỏ hàng của bạn đang trống. Hãy thêm vài món nhé!
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(delta) => updateQuantity(index, delta)}
                  onRemove={() => removeItem(index)}
                  currentQuantityInCart={currentQuantityInCart}
                />
              ))}
            </div>

            <div className="flex justify-end mt-10">
              <div className="bg-white rounded-2xl p-6 shadow-md w-full max-w-md">
                <div className="text-lg font-medium text-gray-800 flex justify-between mb-4">
                  <span>Tổng cộng:</span>
                  <span className="text-red-500 font-bold text-xl">
                    ₫{total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-24  bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow"
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </>
);

};

export default Cart;
