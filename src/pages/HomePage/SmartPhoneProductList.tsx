import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { Product } from "../../types/Product.type";
import { useInView } from "../Detail/UseInView";

const formatCurrency = (amount?: number) => {
  if (!amount) return "";
  return amount.toLocaleString("vi-VN") + " ₫";
};

const SmartPhoneProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const fetchSmartphoneProducts = async () => {
      setLoading(true);
      try {
        const categories = await getCategories();
        const smartphoneCategory = categories.find(
          (cat: any) => cat.name.toLowerCase() === "smartphone"
        );
        if (smartphoneCategory) {
          setCategoryId(smartphoneCategory.id);
          const productRes = await getProducts(smartphoneCategory.id);
          setProducts(productRes);
        }
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchSmartphoneProducts();
  }, []);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  // Lấy đúng 6 sản phẩm + 1 ô "tất cả sản phẩm"
  const mainProducts = products.slice(0, 6);

  // Sản phẩm nổi bật (ô đầu)
  const featured = products[0];
  const BACKEND_URL = "http://localhost:8080";

  // Tổng cộng 7 card: 1 featured, 5 main, 1 "Tất cả sản phẩm"
  // 3 trái: featured + mainProducts[1,2]
  // 4 phải: mainProducts[3,4,5] + "Tất cả sản phẩm"

  return (
    <div
      ref={ref}
      className="w-full bg-gray-100 min-h-[600px] py-8 px-2 md:px-4"
    >
      <h2 className="text-4xl font-bold text-center mb-10">
        Sản phẩm SmartPhone
      </h2>
      {loading ? (
        <div className="text-center text-gray-400 italic text-lg animate-pulse">
          Đang tải sản phẩm...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featured && (
            <a
              href={`/product/${featured.id}`}
              className={`
                relative flex flex-col md:flex-row justify-between bg-white rounded-3xl 
                shadow hover:shadow-xl transition overflow-hidden p-7 hover:-translate-y-1
                  group
                md:col-span-2 md:row-span-1
                 ease-out transform
                ${
                  hasAnimated
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-16"
                }
              `}
              style={{
              transitionDuration: "3000ms", 
            }}
            >
              <div className="flex flex-col justify-between md:w-1/2">
                <div>
                  <div className="text-2xl font-bold mb-2">{featured.name}</div>
                </div>
                <div className="mt-4">
                  <div className="text-gray-500 text-sm mb-1">Từ</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-black">
                      {formatCurrency(featured.price)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-end h-full">
                <img
                  src={
                    featured.thumbnail
                      ? BACKEND_URL + featured.thumbnail
                      : featured.image
                  }
                  alt={featured.name}
                  className="h-[200px] md:h-[240px] w-auto object-contain ml-auto"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            </a>
          )}

          {/* Card 2-6: mainProducts[1]...mainProducts[5] */}
          {mainProducts.slice(1).map((product, idx) => {
            // idx: 0..4
            // idx 0,1 (card 2,3) trái (bay từ trái); idx 2,3,4 (card 4,5,6) phải (bay từ phải)
            const isLeft = idx < 2;
            return (
              <a
                href={`/product/${product.id}`}
                key={product.id}
                
                className={`
                  flex flex-col justify-between bg-white rounded-3xl shadow hover:shadow-xl 
                   overflow-hidden p-7 hover:-translate-y-1  group
                  transition-all duration-1000 ease-out transform
                  ${
                    hasAnimated
                      ? "opacity-100 translate-x-0"
                      : isLeft
                      ? "opacity-0 -translate-x-16"
                      : "opacity-0 translate-x-16"
                  }
                `}
                 style={{
              transitionDuration: "3000ms", // 4 giây, tuỳ ý
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
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-black">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}

          <a
            href={categoryId ? `/category/${categoryId}` : "#"}
            style={{
              transitionDuration: "3000ms", // 4 giây, tuỳ ý
            }}
            className={`
              flex flex-col items-center justify-center rounded-3xl min-h-[320px] bg-gray-100
               shadow hover:shadow-lg  group p-7
              transition-all  ease-out transform
              ${
                hasAnimated
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-16"
              }
            `}
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
                  className="h-24 object-contain rounded-xl"
                />
                {mainProducts[1] && (
                  <img
                    src={BACKEND_URL + mainProducts[1].thumbnail}
                    alt=""
                    className="h-24 object-contain rounded-xl"
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

export default SmartPhoneProductList;
