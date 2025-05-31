import React from 'react';

const CategoriesContent = () => {
  const categories = [
    { id: 1, name: 'Electronics', products: 120 },
    { id: 2, name: 'Fashion', products: 80 },
    { id: 3, name: 'Home Appliances', products: 45 },
    { id: 4, name: 'Books', products: 60 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      <div className="grid grid-cols-2 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.products} products</p>
            <button className="mt-3 text-sm text-blue-500 hover:underline">
              View Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesContent;
