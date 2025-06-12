// productTypes.ts

export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  thumbnail: string;
  type: string;
  companyName: string;
  quantity: number;
  stockQuantity: number;  // Tổng số lượng các biến thể
  categoryId: number;
  position: { top: string; left: string };
  imageIndex: number;
  variants?: ProductVariant[];  // Thêm mảng biến thể vào đây
}
