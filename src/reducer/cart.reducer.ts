import { createAction, createReducer } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho sản phẩm trong giỏ hàng
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Trạng thái ban đầu của giỏ hàng
interface CartState {
  items: CartItem[];
  totalAmount: number; // Tổng tiền của giỏ hàng
}

// Trạng thái ban đầu
const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

// Các action
export const addToCart = createAction<CartItem>("cart/addToCart");
export const removeFromCart = createAction<string>("cart/removeFromCart"); // Tham số là id sản phẩm
export const updateCartItem = createAction<{ id: string; quantity: number }>(
  "cart/updateCartItem"
);
export const clearCart = createAction("cart/clearCart");

// Reducer giỏ hàng
const cartReducer = createReducer(initialState, (builder) => {
  builder
    // Thêm sản phẩm vào giỏ hàng
    .addCase(addToCart, (state, action) => {
      const item = action.payload;

      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
      if (existingItemIndex !== -1) {
        // Cập nhật số lượng sản phẩm đã tồn tại trong giỏ hàng
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        state.items.push(item);
      }

      // Cập nhật tổng tiền giỏ hàng
      state.totalAmount = state.items.reduce(
        (total, currentItem) =>
          total + currentItem.price * currentItem.quantity,
        0
      );
    })
    // Xóa sản phẩm khỏi giỏ hàng
    .addCase(removeFromCart, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Cập nhật tổng tiền giỏ hàng
      state.totalAmount = state.items.reduce(
        (total, currentItem) =>
          total + currentItem.price * currentItem.quantity,
        0
      );
    })
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    .addCase(updateCartItem, (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Cập nhật số lượng sản phẩm
        state.items[itemIndex].quantity = quantity;
      }

      // Cập nhật tổng tiền giỏ hàng
      state.totalAmount = state.items.reduce(
        (total, currentItem) =>
          total + currentItem.price * currentItem.quantity,
        0
      );
    })
    // Xóa toàn bộ giỏ hàng
    .addCase(clearCart, (state) => {
      state.items = [];
      state.totalAmount = 0;
    });
});

export default cartReducer;
