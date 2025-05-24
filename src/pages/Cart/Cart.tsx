import React, { useEffect, useState } from "react";
import CartItem from "../Cart/CartItem";
import Header from "../../components/commom/Header/Header";
import { getACart, updateCart, deleteCart } from "../../api/cart";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Chuyển item từ API về định dạng hiển thị trong cart
  const mapApiItemToCartItem = (apiItem: any) => ({
    id: apiItem.id,
    name: apiItem.productName || "Tên sản phẩm",
    image: apiItem.thumbnail || "/placeholder.png",
    productPrice: Number(apiItem.unitPrice || 0),
    quantity: apiItem.quantity || 1,
    variation: `Màu: ${apiItem.color || "N/A"}, Size: ${apiItem.size || "N/A"}`,
    originalPrice: Number(apiItem.originalPrice || 0),
    stockQuantity: Number(apiItem.stockQuantity ?? 10), // fallback để test
  });

  const loadCart = async () => {
    try {
      const data = await getACart();
      if (Array.isArray(data.items)) {
        const mappedItems = data.items.map(mapApiItemToCartItem);
        setCartItems(mappedItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);
const currentQuantityInCart = (variantId: number): number => {
  return cartItems
    .filter((item) => item.id === variantId)
    .reduce((sum, item) => sum + item.quantity, 0);
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
    } catch (error: any) {
      console.error("Lỗi cập nhật số lượng:", error.response?.data || error.message);
    }
  };

  const removeItem = async (index: number) => {
    const item = cartItems[index];
    try {
      await deleteCart(item.id);
      const updated = cartItems.filter((_, i) => i !== index);
      setCartItems(updated);
    } catch (error: any) {
      console.error("Lỗi xóa sản phẩm:", error.response?.data || error.message);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 0),
    0
  );

  const handleBuyNow = () => {
    alert("Chuyển tới trang thanh toán!");
  };

  return (
    <>
      <Header />
      <div className="p-6 space-y-4 bg-yellow-50 text-gray-800 min-h-screen">
        <div className="grid grid-cols-12 font-bold border-b pb-2 text-gray-400">
          <div className="col-span-5">Sản Phẩm</div>
          <div className="col-span-2 text-center">Đơn Giá</div>
          <div className="col-span-2 text-center">Số Lượng</div>
          <div className="col-span-2 text-center">Số Tiền</div>
          <div className="col-span-1 text-center">Thao Tác</div>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Giỏ hàng của bạn đang trống
          </p>
        ) : (
          cartItems.map((item, index) => (
           <CartItem
  key={item.id}
  item={item}
  onQuantityChange={(delta) => updateQuantity(index, delta)}
  onRemove={() => removeItem(index)}
  currentQuantityInCart={currentQuantityInCart}
/>

          ))
        )}

        {cartItems.length > 0 && (
          <div className="flex justify-end items-center gap-6 mt-6 px-6 py-4 rounded-xl">
            <div className="text-black text-lg">
              Tổng tiền:{" "}
              <span className="text-red-500 font-semibold">
                ₫{total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleBuyNow}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow-md"
            >
              Mua Ngay
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
