import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "../Cart/CardItem";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import Header from "../../components/commom/Header/Header";
import { getACart } from "../../api/cart";
import { Product } from "../../types/Product.type";

const ITEMS_PER_PAGE = 8;

const priceRanges = [
  { label: "Dưới 500,000", value: "under500", min: 0, max: 500000 },
  { label: "Dưới 1,000,000", value: "under1000", min: 0, max: 1000000 },
  { label: "1,000,000 - 2,000,000", value: "1to2", min: 1000000, max: 2000000 },
  { label: "2,000,000 - 5,000,000", value: "2to5", min: 2000000, max: 5000000 },
  {
    label: "5,000,000 - 10,000,000",
    value: "5to10",
    min: 5000000,
    max: 10000000,
  },
  { label: "Trên 10,000,000", value: "above10", min: 10000000, max: Infinity },
];

const CategoryProductListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const [stockFilter, setStockFilter] = useState<
    "all" | "instock" | "outofstock"
  >("all");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc">(
    "price-asc"
  );
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        const category = categories.find((cat: any) => String(cat.id) === id);

        if (category) {
          setCategoryName(category.name);
          const res = await getProducts(category.id);
          setProducts(res);
        } else {
          setCategoryName("Không xác định");
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  useEffect(() => {
    const fetchCart = async () => {
      const cart = await getACart();
      setCartItems(cart.items || []);
    };
    fetchCart();
  }, []);

  // Reset currentPage mỗi khi filter hoặc sort thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPriceRange, stockFilter, sortOption]);

  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariant?.id === variantId);
    return item ? item.quantity : 0;
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.value === selectedPriceRange);
        if (
          range &&
          !(product.price >= range.min && product.price < range.max)
        ) {
          return false;
        }
      }
      if (stockFilter === "instock" && product.stockQuantity <= 0) return false;
      if (stockFilter === "outofstock" && product.stockQuantity > 0)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <div className="max-w-[1400px] mx-auto py-8 px-4 mt-24">
        <h1 className="text-3xl font-bold mb-6 text-orange-600 uppercase">
          Danh mục: {categoryName}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-[470px] border p-4 rounded-2xl shadow bg-orange-50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg text-orange-700">Lọc</h2>
              <button
                onClick={() => {
                  setSelectedPriceRange(null);
                  setStockFilter("all");
                }}
                className="text-sm text-red-500 hover:underline"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-orange-500">
                Sắp xếp theo giá
              </h3>
              <select
                className="w-full border rounded px-2 py-1 text-sm text-yellow-600"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-orange-600 mb-2">Khoảng giá</h3>
              {priceRanges.map((range) => (
                <div key={range.value} className="mb-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={() => setSelectedPriceRange(range.value)}
                      className="accent-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {range.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-2">
              <h3 className="font-medium text-orange-600 mb-2">Tình trạng</h3>
              <select
                className="w-full border rounded px-2 py-1 text-yellow-800"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="instock">Còn hàng</option>
                <option value="outofstock">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
            ) : paginatedProducts.length === 0 ? (
              <p className="text-center text-gray-500">
                Không có sản phẩm phù hợp.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <CardItem
                    key={product.id}
                    product={product}
                    currentQuantityInCart={currentQuantityInCart}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-orange-200 text-orange-700 rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-orange-700 font-semibold">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-orange-200 text-orange-700 rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProductListPage;
