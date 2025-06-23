import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../../api/products";
import CardItem from "../../pages/Cart/CardItem";
import FooterComponent from "../commom/FooterComponent";
import { getACart } from "../../api/cart";
import Header from "./Header/Header";

const ITEMS_PER_PAGE = 8;

const priceRanges = [
  { label: "Dưới 500,000", value: "under500", min: 0, max: 500000 },
  { label: "Dưới 1,000,000", value: "under1000", min: 0, max: 1000000 },
  { label: "1,000,000 - 2,000,000", value: "1to2", min: 1000000, max: 2000000 },
  { label: "2,000,000 - 5,000,000", value: "2to5", min: 2000000, max: 5000000 },
  { label: "5,000,000 - 10,000,000", value: "5to10", min: 5000000, max: 10000000 },
  { label: "Trên 10,000,000", value: "above10", min: 10000000, max: Infinity },
];

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchProducts", keyword],
    queryFn: () => searchProducts(keyword),
    enabled: !!keyword,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "instock" | "outofstock">("all");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc">("price-asc");

  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getACart();
        setCartItems(cart.items || []);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };
    fetchCart();
  }, []);

  const currentQuantityInCart = (variantId: number) => {
    const item = cartItems.find((i) => i.productVariant?.id === variantId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, selectedPriceRange, stockFilter, sortOption]);

  if (isLoading) return <p className="text-center mt-20">Đang tải...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        Đã xảy ra lỗi khi tải sản phẩm.
      </p>
    );

  const products = data ?? [];

  const filteredProducts = products.filter((product: any) => {
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.value === selectedPriceRange);
      if (range && !(product.price >= range.min && product.price < range.max)) {
        return false;
      }
    }
    if (stockFilter === "instock" && product.stockQuantity <= 0) return false;
    if (stockFilter === "outofstock" && product.stockQuantity > 0) return false;
    return true;
  });

  const sortedProducts = filteredProducts.sort((a: any, b: any) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <div className="max-w-[1400px] mx-auto py-6 px-4 mt-12">
        <h1 className="text-3xl font-bold mb-2 text-orange-600 text-center">
          Kết quả tìm kiếm
        </h1>
        <p className="text-lg text-gray-600 text-center mb-6">
          Tìm thấy {filteredProducts.length} sản phẩm cho "{keyword}"
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 h-[470px] bg-orange-50 border border-orange-300 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-orange-600 mb-4">Bộ lọc</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-orange-500">Sắp xếp theo giá</h3>
              <select
                className="w-full border rounded px-2 py-1 text-sm text-orange-600"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-orange-600">Khoảng giá</h3>
              {priceRanges.map((range) => (
                <div key={range.value} className="mb-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={() =>
                        setSelectedPriceRange(
                          selectedPriceRange === range.value ? null : range.value
                        )
                      }
                      className="accent-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-700">Tình trạng</h3>
              <select
                className="w-full border rounded px-2 py-1 text-sm text-yellow-800"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="instock">Còn hàng</option>
                <option value="outofstock">Hết hàng</option>
              </select>
            </div>

            <button
              className="mt-2 text-sm text-orange-500 hover:underline"
              onClick={() => {
                setSelectedPriceRange(null);
                setStockFilter("all");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>

          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <p className="text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((product: any) => (
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-orange-200 text-orange-700 rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-orange-700 font-semibold">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      <FooterComponent />
    </>
  );
};

export default SearchResultsPage;
