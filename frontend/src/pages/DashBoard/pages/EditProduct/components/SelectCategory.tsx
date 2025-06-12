import React, { useState } from "react";
import { Description, Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface CategoryType {
  id: string | number;
  name: string;
}

interface CategoriesProps {
  categories: CategoryType[] | null;
  setIdCategory: any; // Selected category from state
}

const SelectCategory = ({ categories, setIdCategory }: CategoriesProps) => {
  // State to store selected category
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");

  // Handle change of select value
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdCategory(event.target.value);
    setSelectedCategory(event.target.value); // Update the state with the selected value
  };

  console.log(selectedCategory); // You can log the selected value for debugging
  console.log("Categories:", categories);

  return (
    <div className="w-full max-w-md px-4">
      <Field>
        <Label className="text-sm/6 font-medium text-black">Category</Label>
        <div className="relative">
          <Select
            value={selectedCategory} // Bind the select value to state
            onChange={handleChange} // Update the state on change
            className={clsx(
              "mt-3 block w-full appearance-none rounded-lg border-none bg-gray-300 py-1.5 px-3 text-sm/6 text-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              "*:text-black"
            )}
          >
            <option>Chọn loại</option>
            {categories?.map((category: CategoryType) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            )) ?? <option value="">No categories available</option>}
          </Select>
          <ChevronDownIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
};

export default SelectCategory;