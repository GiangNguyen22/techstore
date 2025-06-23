import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: any;
  size?: "large" | "small";
  hidePrice?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = "small",
  hidePrice = false,
}) => {
  const isLarge = size === "large";
  const width = isLarge ? 560 : 280;
  const height = isLarge ? 610 : 280;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ width, height }}
      className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group block"
    >
      {/* Hình ảnh sản phẩm */}
      <img
        src={
          product.thumbnail
            ? "http://localhost:8080" + product.thumbnail
            : "/no-image.png"
        }
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay thông tin */}
      <div className="absolute bottom-0 text-center w-full bg-gradient-to-t from-black/60 to-transparent p-4 text-black">
        <h3
          className={`font-semibold line-clamp-2 ${
            isLarge ? "text-2xl mb-16" : "text-xl mb-14"
          }`}
        >
          {product.name}
        </h3>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-6
       opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <Link
          to={`/product/${product.id}`}
          className="bg-black text-white text-xs font-semibold py-2 px-5 rounded-full shadow-md hover:bg-white hover:text-black transition"
        >
          Mua ngay
        </Link>
      </div>
    </Link>
  );
};

export default ProductCard;
