// orderTypes.ts
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
export interface OrderItemDto {
  id: number;
  productName: string;
  variantName: string;
  quantity: number;
}

export interface OrderDetailDto {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productVariantId: number;
  quantity: number;
  unitPrice: number;
  orderStatus: string;
    productThumbnail?: string; // thêm trường này

}

