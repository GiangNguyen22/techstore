import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { getProducts } from '../../api/products';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  status: string;
}

const TopProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProducts()
      .then((data) => {
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Products</h3>
        <button className="text-sm text-blue-500">All products</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-gray-500 text-sm">No products found.</div>
        ) : (
          filteredProducts.slice(0,10).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">Item: #{product.sku}</div>
                </div>
              </div>
              <div className="text-lg font-bold">${parseFloat(product.price).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;
