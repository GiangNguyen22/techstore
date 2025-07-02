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
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
    new Set()
  );

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
        // Mặc định chọn tất cả sản phẩm
        setSelectedItemIds(new Set(mappedItems.map((item: any) => item.id)));
        window.dispatchEvent(
          new CustomEvent("cart-updated", { detail: mappedItems })
        );
      } else {
        setCartItems([]);
        setSelectedItemIds(new Set());
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }));
      }
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      setCartItems([]);
      setSelectedItemIds(new Set());
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

  const removeItem = async (index: number) => {
    const item = cartItems[index];
    try {
      await deleteCart(item.id);
      const updated = cartItems.filter((_, i) => i !== index);
      setCartItems(updated);
      setSelectedItemIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
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

  const handleBuyNow = () => {
  const selectedItems = cartItems.filter((item) =>
  selectedItemIds.has(item.id)
);

    if (selectedItems.length === 0) {
      showMessage("Vui lòng chọn ít nhất một sản phẩm để mua.", "error");
      return;
    }
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

    const orderItems = selectedItems.map((item) => ({
  productId: item.productId,
  productVariantId: item.productVariantId,
  quantity: item.quantity,
}));

    const cartItemIds = selectedItems.map((item) => item.id); // 👈 gửi thêm ID giỏ hàng

    navigate("/order", {
      state: {
        orderItems,
        cartItemIds, 
      },
    });
  };
  const toggleCheck = (itemId: number, checked: boolean) => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const total = cartItems.reduce((sum, item) => {
    return selectedItemIds.has(item.id)
      ? sum + item.productPrice * item.quantity
      : sum;
  }, 0);

  useEffect(() => {
    loadCart();
  }, []);
return (
  <>
    <Header />
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <span className="text-4xl">🛒</span> Giỏ hàng của bạn
        </h2>

        <div className="grid grid-cols-12 font-semibold text-gray-700 border-b border-gray-200 pb-1 text-base bg-white rounded-t-xl shadow-sm">
          <div className="col-span-1 text-center flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedItemIds.size === cartItems.length && cartItems.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItemIds(new Set(cartItems.map((item) => item.id)));
                } else {
                  setSelectedItemIds(new Set());
                }
              }}
              className="h-5 w-5 accent-orange-500 cursor-pointer"
              title="Chọn tất cả"
              style={{ borderRadius: 4, border: "1.5px solid #d1d5db" }}
            />
          </div>
          <div className="col-span-4 text-center">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-center">Số tiền</div>
          <div className="col-span-1 text-center">Xóa</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-24 bg-white rounded-b-xl shadow mt-2">
            <span className="text-7xl mb-4">🛍️</span>
            <div className="text-center text-gray-500 text-lg font-medium">
              Giỏ hàng của bạn đang trống. Hãy thêm vài món nhé!
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 text-base"
            >
              <span className="text-lg">🛒</span>
              Tiếp tục mua sắm
            </button>
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
                  checked={selectedItemIds.has(item.id)}
                  onCheckChange={(checked) => toggleCheck(item.id, checked)}
                />
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 mt-12">
              <button
                onClick={() => navigate("/")}
                className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 flex items-center gap-2 transition-all duration-200 text-base"
              >
                <span className="text-lg">🛍️</span> Tiếp tục mua sắm
              </button>
              <div className="bg-white rounded-xl p-8 shadow w-full max-w-md border-t border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-2xl">🧾</span> Tổng cộng:
                  </span>
                  <span className="text-orange-600 font-extrabold text-3xl">
                    ₫{total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 rounded-xl transition-all shadow flex items-center justify-center gap-2 text-base"
                >
                  <span className="text-xl">💳</span> Mua ngay
                </button>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setSelectedItemIds(new Set())}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-600 transition"
                  >
                    <span>❎</span> Bỏ chọn tất cả
                  </button>
                  <button
                    onClick={() => setSelectedItemIds(new Set(cartItems.map((item) => item.id)))}
                    className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 transition"
                  >
                    <span>✅</span> Chọn tất cả
                  </button>
                </div>
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
