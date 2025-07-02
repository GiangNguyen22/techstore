import React, { useEffect, useState } from "react";
import CardItem from "../Cart/CardItem";
import ProductModal from "../Cart/ProductModal";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { getACart } from "../../api/cart";
import { Product } from "../../types/Product.type";
import { useNotification } from "../../pages/Detail/NotificationProvider";

const LaptopProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { showMessage } = useNotification();

  // Lấy lại giỏ hàng
  const refreshCart = async () => {
    try {
      const cart = await getACart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  };

  // Lấy sản phẩm Laptop và giỏ hàng ban đầu
  useEffect(() => {
    const fetchLaptopProducts = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        const laptopCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "laptop"
        );

        if (laptopCategory) {
          setCategoryId(laptopCategory.id);
          const productRes = await getProducts(laptopCategory.id);
          const productsWithVariants = productRes.map((p: any) => ({
            ...p,
            variants: p.variants?.map((v: any) => ({
              id: v.id,
              stockQuantity: v.stockQuantity,
              color: v.color ?? "defaultColor",
              size: v.size ?? "defaultSize",
            })),
          }));
          setProducts(productsWithVariants);
        } else {
          console.warn("Không tìm thấy category tên 'Laptop'");
        }

        await refreshCart();
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm Laptop hoặc giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptopProducts();
  }, []);

  // Trả về số lượng đã có trong giỏ theo variant
  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariantId === variantId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="my-10 px-6 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          LAPTOP
        </h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 italic text-lg animate-pulse">
          Đang tải sản phẩm...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 italic text-lg">
          Không có sản phẩm nào trong danh mục Laptop.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <CardItem
              key={product.id}
              product={product}
              onClickAddToCart={() => setSelectedProduct(product)}
              currentQuantityInCart={currentQuantityInCart}
              refreshCart={refreshCart}
            />
          ))}
        </div>
      )}
      {categoryId && products.length > 0 && (
        <div className="flex justify-center mt-10 w-full">
          <a
            href={`/category/${categoryId}`}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600 font-bold text-base tracking-widest shadow-lg transition-all duration-300 group"
          >
            XEM TẤT CẢ
            <span className="text-2xl group-hover:translate-x-1 transition-transform duration-200">
              &rarr;
            </span>
          </a>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={async (variantId, quantity) => {
            await refreshCart();
            setSelectedProduct(null);
            showMessage(
              `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
              "success"
            );
          }}
          currentQuantityInCart={currentQuantityInCart}
        />
      )}
    </div>
  );
};

export default LaptopProductList;
