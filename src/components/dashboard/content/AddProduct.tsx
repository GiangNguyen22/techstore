import React, { useState } from 'react';

const AddProductContent = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📦 New Product:', product);
    // TODO: Gửi API ở đây
    alert('Product added!');
    setProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      status: 'active',
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductContent;
