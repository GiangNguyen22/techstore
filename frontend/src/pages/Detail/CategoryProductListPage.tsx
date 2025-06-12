import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardItem from "../Cart/CardItem";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import Header from "../../components/commom/Header/Header";
import Register from "../../components/Register";
import UserChatPopup from "../../components/Chat/UserChatPopUp";
import { getUserProfile } from "../../api/users";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  discount: number;
  image: string;
  thumbnail: string;
  type: string;
  companyName: string;
  quantity: number;
  categoryId: number;
  position: { top: string; left: string };
  imageIndex: number;
}

const priceRanges = [
  { label: "Dưới 500,000", value: "under500", min: 0, max: 500000 },
  { label: "Dưới 1,000,000", value: "under1000", min: 0, max: 1000000 },
  { label: "1,000,000 - 2,000,000", value: "1to2", min: 1000000, max: 2000000 },
  { label: "2,000,000 - 5,000,000", value: "2to5", min: 2000000, max: 5000000 },
  { label: "5,000,000 - 10,000,000", value: "5to10", min: 5000000, max: 10000000 },
  { label: "Trên 10,000,000", value: "above10", min: 10000000, max: Infinity },
];

const CategoryProductListPage: React.FC = () => {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || '');
   const [username, setUsername] = useState<string | null>(null);
   const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(); // gọi API
        setUsername(res.name); // hoặc res.data.username tùy định dạng
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };

    fetchProfile();
  }, []);
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "instock" | "outofstock">("all");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc">("price-asc");

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
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  const filteredAndSortedProducts = products
    .filter((product) => {
      if (selectedPriceRange) {
        const range = priceRanges.find((r) => r.value === selectedPriceRange);
        if (range && !(product.price >= range.min && product.price < range.max)) {
          return false;
        }
      }
      if (stockFilter === "instock" && product.stockQuantity <= 0) return false;
      if (stockFilter === "outofstock" && product.stockQuantity > 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Header />
      <div className="max-w-[1400px] mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-4 uppercase">Danh mục: {categoryName}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Bộ lọc bên trái */}
          <div className="w-full md:w-64 border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Lọc</h2>
              <button
                onClick={() => {
                  setSelectedPriceRange(null);
                  setStockFilter("all");
                }}
                className="text-sm text-red-500"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Khoảng giá</h3>
              {priceRanges.map((range) => (
                <div key={range.value} className="mb-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={selectedPriceRange === range.value}
                      onChange={() => setSelectedPriceRange(range.value)}
                      className="accent-pink-500"
                    />
                    <span className="ml-2">{range.label}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-2">
              <h3 className="font-medium mb-2">Tồn kho</h3>
              <select
                className="w-full border rounded px-2 py-1"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
              >
                <option value="all">Tất cả</option>
                <option value="instock">Còn hàng</option>
                <option value="outofstock">Hết hàng</option>
              </select>
            </div>
          </div>

          {/* Danh sách và sắp xếp */}
          <div className="flex-1">
            {/* Thanh điều khiển */}
            <div className="flex justify-end items-center mb-4 gap-4">
              <div>
                <label className="mr-2 font-medium">Sắp xếp theo</label>
                <select
                  className="border rounded px-2 py-1"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="price-asc">Giá: thấp - cao</option>
                  <option value="price-desc">Giá: cao - thấp</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : filteredAndSortedProducts.length === 0 ? (
              <p>Không có sản phẩm phù hợp.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedProducts.map((product) => (
                  <CardItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
       {token && !isAdmin && <UserChatPopup authToken={token} username={username}/>}
      </div>
      <Register />
    </>
  );
};

export default CategoryProductListPage;
