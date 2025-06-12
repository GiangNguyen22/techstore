import React, { useEffect, useState } from "react";
import CardItem from "../Cart/CardItem";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import Header from "../../components/commom/Header/Header";
import Register from "../../components/Register";

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

interface Category {
  id: number;
  name: string;
}

const LaptopProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLaptopProducts = async () => {
      try {
        setLoading(true);
        const categories: Category[] = await getCategories();
        const laptopCategory = categories.find(
          (cat) => cat.name.toLowerCase() === "laptop"
        );

        if (laptopCategory) {
          setCategoryId(laptopCategory.id); // lưu categoryId để dùng ở ngoài
          const productRes = await getProducts(laptopCategory.id);
          setProducts(productRes);
        } else {
          console.warn("Không tìm thấy category tên 'Laptop'");
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm Laptop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptopProducts();
  }, []);
  const handleAddToCart = (product: Product) => {
    // Gọi dispatch Redux hoặc context hoặc localStorage v.v...
    console.log("Thêm vào giỏ hàng:", product.name);
  };

  return (
   <>
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
      <p className="text-center text-gray-400 italic text-lg animate-pulse">Đang tải sản phẩm...</p>
    ) : products.length === 0 ? (
      <p className="text-center text-gray-400 italic text-lg">
        Không có sản phẩm nào trong danh mục Laptop.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {products.map((product) => (
          <CardItem
            key={product.id}
            product={product}
            onClickAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    )}
  </div>
</>

  );
};

export default LaptopProductList;
