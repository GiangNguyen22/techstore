import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { getProducts } from '../../../api/products';
import { get } from 'http';


interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  status: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product List</h2>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white shadow-sm border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-medium text-gray-600">Product ID</th>
              <th className="py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 font-medium text-gray-600">SKU</th>
              <th className="py-3 px-4 font-medium text-gray-600">Price</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{product.id}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.sku}</td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : product.status === 'Out of Stock'
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-500 text-sm hover:underline flex items-center gap-1">
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
