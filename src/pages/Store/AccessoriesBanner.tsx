import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/categories";
import { useNavigate } from "react-router-dom";
const AccessoriesBanner: React.FC = () => {
  const [accessoryCategoryId, setAccessoryCategoryId] = useState<
    string | undefined
  >(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await getCategories();
        const accessories = categories.find(
          (cat: any) => cat.name.toLowerCase() === "accessories"
        );
        if (accessories) setAccessoryCategoryId(accessories.id);
      } catch {
        setAccessoryCategoryId(undefined);
      }
    };
    fetchCategory();
  }, []);

  const handleViewAll = () => {
    if (accessoryCategoryId) {
      navigate(`/category/${accessoryCategoryId}`);
    }
  };
  return (
    <section className="w-full bg-white py-6 px-2">
      <div className="max-w-[1330px] mx-auto rounded-lg overflow-hidden relative flex flex-col md:flex-row items-center" style={{ backgroundColor: "#f8f8f8" }}>
        {/* Text Section */}
        <div className="flex-1 p-8 md:pl-10 md:py-12 z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6 text-black max-w-[420px]">
            Khám phá các phụ kiện được thiết kế mới
          </h2>
          <button
            className="bg-black text-white font-semibold rounded-full px-7 py-3 text-base shadow-md hover:bg-gray-800 transition"
            onClick={handleViewAll}
            disabled={!accessoryCategoryId}
          >
            Xem tất cả
          </button>
        </div>
        {/* Image Section */}
        <div className="flex-1 w-full h-[200px] md:h-[340px] relative">
          <img
            src="https://images.samsung.com/is/image/samsung/assets/vn/accessories/202502/Accessories_Discover_Banner_PC.jpg?$1440_N_JPG$"
            alt="Phụ kiện Galaxy S25"
            className="object-contain w-full h-full"
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AccessoriesBanner;
