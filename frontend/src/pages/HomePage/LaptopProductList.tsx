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
    <div className="my-10 px-6 md:px-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          LAPTOP
        </h2>
        {categoryId && (
          <a
            href={`/category/${categoryId}`}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm uppercase tracking-wide transition-colors duration-300"
          >
            XEM TẤT CẢ &rarr;
          </a>
        )}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={async (variantId, quantity) => {
            await refreshCart();
            setSelectedProduct(null);
            showMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, "success");
          }}
          currentQuantityInCart={currentQuantityInCart}
        />
      )}
    </div>
  );
};

export default LaptopProductList;
