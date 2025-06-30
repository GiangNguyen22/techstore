import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { Product } from "../../types/Product.type";
import { useInView } from "../Detail/UseInView";

const formatCurrency = (amount?: number) => {
  if (!amount) return "";
  return amount.toLocaleString("vi-VN") + " ₫";
};

const GamingTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView(0.15);
  const BACKEND_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchGamingProducts = async () => {
      setLoading(true);
      try {
        const categories = await getCategories();
        const gamingTableCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "gamingtable"
        );
        if (gamingTableCategory) {
          setCategoryId(gamingTableCategory.id);
          const productRes = await getProducts(gamingTableCategory.id);
          setProducts(productRes);
        }
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchGamingProducts();
  }, []);

  const mainProducts = products.slice(0, 6);
  const featured = products[0];

  return (
    <div
      ref={ref}
      className="w-full bg-gray-100 min-h-[600px] py-8 px-2 md:px-4"
    >
      <h2 className="text-4xl font-bold text-center mb-10">Bàn Gaming</h2>
      {loading ? (
        <div className="text-center text-gray-400 italic text-lg animate-pulse">
          Đang tải sản phẩm...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Featured Card */}
          {featured && (
            <a
              href={`/product/${featured.id}`}
              className={`
                relative flex flex-col md:flex-row justify-between bg-white rounded-3xl shadow p-7
                hover:shadow-xl hover:-translate-y-1 group md:col-span-2 md:row-span-1
                transform transition-all ease-out duration-1000
                ${inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
              `}
              style={{
                minHeight: 320,
                transitionDelay: "300ms",
              }}
            >
              <div className="flex flex-col justify-between md:w-1/2">
                <div className="text-2xl font-bold mb-2">{featured.name}</div>
                <div className="mt-4">
                  <div className="text-gray-500 text-sm mb-1">Từ</div>
                  <div className="text-2xl font-extrabold text-black">
                    {formatCurrency(featured.price)}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-end">
                <img
                  src={
                    featured.thumbnail
                      ? BACKEND_URL + featured.thumbnail
                      : featured.image
                  }
                  alt={featured.name}
                  className="h-[200px] md:h-[240px] object-contain ml-auto"
                />
              </div>
            </a>
          )}

          {/* Other Products */}
          {mainProducts.slice(1).map((product, index) => (
            <a
              href={`/product/${product.id}`}
              key={product.id}
              className={`
                flex flex-col justify-between bg-white rounded-3xl shadow-lg p-7 group
                transform transition-all ease-out duration-1000
                ${inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
              `}
              style={{
                minHeight: 320,
                transitionDelay: `${index * 400}ms`,
              }}
            >
              <div>
                <div className="text-lg font-bold mb-2">{product.name}</div>
              </div>
              <div className="flex-1 flex items-center justify-center my-2 min-h-[100px]">
                <img
                  src={
                    product.thumbnail
                      ? BACKEND_URL + product.thumbnail
                      : product.image
                  }
                  alt={product.name}
                  className="max-h-32 object-contain group-hover:scale-105 transition"
                />
              </div>
              <div className="mt-4">
                <div className="text-gray-500 text-sm mb-1">Từ</div>
                <div className="text-xl font-extrabold text-black">
                  {formatCurrency(product.price)}
                </div>
              </div>
            </a>
          ))}

          {/* All Products Card */}
          <a
            href={categoryId ? `/category/${categoryId}` : "#"}
            className={`
              flex flex-col items-center justify-center rounded-3xl min-h-[320px] bg-gray-100 shadow p-7
              transform transition-all ease-out duration-1000
              ${inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
            `}
            style={{
              transitionDelay: "2200ms",
            }}
          >
            <div className="text-lg font-bold mb-4">
              Tất cả sản phẩm{" "}
              <span className="inline-block align-middle">
                <svg width={20} height={20} className="inline">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="#111"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M7 10l3 3 3-3"
                    stroke="#111"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </div>
            {featured && (
              <div className="flex gap-4">
                <img
                  src={BACKEND_URL + featured.thumbnail || featured.image}
                  alt=""
                  className="h-20 object-contain rounded-xl"
                />
                {mainProducts[1] && (
                  <img
                    src={BACKEND_URL + mainProducts[1].thumbnail}
                    alt=""
                    className="h-20 object-contain rounded-xl"
                  />
                )}
              </div>
            )}
          </a>
        </div>
      )}
    </div>
  );
};

export default GamingTable;
