import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    image: string;
    productPrice: number;
    quantity: number;
    variation: string;
    originalPrice: number;
    stockQuantity: number;
  };
  onQuantityChange: (delta: number) => void;
  onRemove: () => void;
  currentQuantityInCart: (variantId: number) => number;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  currentQuantityInCart,
}) => {
  const currentQty = currentQuantityInCart(item.id); // tổng số lượng đã có trong giỏ hàng
  const remaining = item.stockQuantity - currentQty + item.quantity; // trừ nhưng cộng lại của chính item này

  const disableIncrease = item.quantity >= remaining;

  return (
    <div className="grid grid-cols-12 items-center border-b pb-4">
      <div className="col-span-5 flex gap-4 items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover border"
        />
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-600">{item.variation}</div>
        </div>
      </div>

      <div className="col-span-2 text-center text-red-600 font-semibold">
        ₫{item.productPrice.toLocaleString()}
      </div>

      <div className="col-span-2 flex justify-center items-center gap-2">
        <button
          onClick={() => onQuantityChange(-1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={item.quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(1)}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={disableIncrease}
        >
          <Plus size={16} />
        </button>
        <span className="text-xs text-gray-500 ml-2">
          (Còn lại: {remaining > 0 ? remaining : 0})
        </span>
      </div>

      <div className="col-span-2 text-center font-semibold">
        ₫{(item.productPrice * item.quantity).toLocaleString()}
      </div>

      <div className="col-span-1 text-center">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
