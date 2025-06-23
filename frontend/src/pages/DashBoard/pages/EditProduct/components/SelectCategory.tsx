import React, { useEffect, useState } from "react";
import { Label } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface CategoryType {
  id: number; 
  name: string;
}

interface CategoriesProps {
  categories: CategoryType[] | null;
  setIdCategory: React.Dispatch<React.SetStateAction<number>>;
}

const SelectCategory = ({ categories, setIdCategory }: CategoriesProps) => {
  // State lưu id category đang chọn, khởi tạo bằng rỗng
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  // Khi categories load xong lần đầu và chưa có giá trị chọn, set default là id đầu tiên
  useEffect(() => {
    if (
      categories &&
      categories.length > 0 &&
      (selectedCategory === "" || selectedCategory === null)
    ) {
      setSelectedCategory(categories[0].id);
      setIdCategory(categories[0].id);
    }
  }, [categories, selectedCategory, setIdCategory]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setSelectedCategory(value);
    setIdCategory(value);
  };

  return (
    <div className="w-full max-w-md px-4">
      <label className="text-sm font-medium text-black">Loại sản phẩm</label>
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={handleChange}
          className={clsx(
            "mt-2 block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-black",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          )}
        >
          {!categories || categories.length === 0 ? (
            <option value="">Không có danh mục nào</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          )}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute top-3 right-3 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SelectCategory;
