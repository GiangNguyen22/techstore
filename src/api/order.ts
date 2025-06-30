import instance from "./interceptor"; // dùng axios instance đã cấu hình

export interface OrderDetailRequest {
  productId: number;
  productVariantId: number;
  quantity: number;
}

export interface OrderRequest {
  address: string;
  phone: string;
  paymentMethod: string;
  totalAmount: number;
  orderDetailRequests: OrderDetailRequest[];
}

// ✅ Gửi request tạo đơn hàng với instance (token sẽ tự động gắn)
export async function createOrder(orderRequest: OrderRequest) {
  return instance.post("/order", orderRequest);
}

// ✅ Lấy danh sách đơn hàng của user
export async function getUserOrders() {
  return instance.get("/order/user");
}

// ✅ Hủy đơn hàng
export async function cancelOrder(orderId: number) {
  return instance.put(`/order/cancel/${orderId}`);
}
