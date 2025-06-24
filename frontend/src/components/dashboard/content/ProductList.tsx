import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { getProducts, getProductById } from '../../../api/products';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  status: string;
}

interface Variant {
  id: number;
  color: string;
  size: string;
  stockQuantity: number;
  productId: number;
}

interface Resource {
  id: number;
  name: string;
  url: string;
  productId: number;
}

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  thumbnail: string;
  type: string;
  companyName: string;
  categoryId: number;
  status: string;
  variants: Variant[];
  resources: Resource[];
}

interface ProductDetailResponse {
  productDto: ProductDetail;
  file: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewProduct = async (id: string) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    try {
      const res: ProductDetailResponse = await getProductById(parseInt(id, 10));
      setSelectedProduct(res.productDto);
    } catch (err) {
      console.error('Failed to load product details:', err);
      setSelectedProduct(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F9F9F9] text-[#1D1D1F] dark:bg-[#1C1C1E] dark:text-[#F9F9F9]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product List</h2>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A6] dark:text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search for a product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl w-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#007AFF] shadow-sm transition-all bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#F9F9F9]"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#2C2C2E] shadow-sm border dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#3A3A3C] border-b text-left text-[#A1A1A6] dark:text-gray-300 uppercase text-xs">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Price</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition">
                <td className="py-3 px-5">{product.id}</td>
                <td className="py-3 px-5">{product.name}</td>
                <td className="py-3 px-5">${product.price}</td>
                <td className="py-3 px-5">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'Active'
                        ? 'bg-green-50 text-[#34C759] dark:bg-green-900 dark:text-green-400'
                        : product.status === 'Out of Stock'
                        ? 'bg-gray-100 text-[#A1A1A6] dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-yellow-50 text-[#FFCC00] dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <button
                    onClick={() => handleViewProduct(product.id)}
                    className="text-[#007AFF] hover:underline flex items-center gap-1 transition dark:text-blue-400"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 px-5 text-center text-[#A1A1A6] dark:text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>

            {loadingDetail ? (
              <p className="text-[#A1A1A6] dark:text-gray-400">Loading...</p>
            ) : selectedProduct ? (
              <>
                <div className="flex gap-4 mb-4">
                  <img
                    src={selectedProduct.thumbnail}
                    alt="Thumbnail"
                    className="w-32 h-32 object-cover rounded-lg shadow"
                  />
                  <div className="flex-1 text-sm space-y-1">
                    <p><strong>Name:</strong> {selectedProduct.name}</p>
                    <p><strong>Description:</strong> {selectedProduct.description}</p>
                    <p><strong>Price:</strong> ${selectedProduct.price}</p>
                    <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
                    <p><strong>Status:</strong> {selectedProduct.status}</p>
                    <p><strong>Type:</strong> {selectedProduct.type}</p>
                    <p><strong>Company:</strong> {selectedProduct.companyName}</p>
                    <p><strong>Category ID:</strong> {selectedProduct.categoryId}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">Variants:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedProduct.variants.map((v) => (
                      <li key={v.id}>{v.color} / {v.size} – Stock: {v.stockQuantity}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-medium">Resources:</p>
                  <ul className="list-disc pl-5 text-sm text-[#007AFF] dark:text-blue-400">
                    {selectedProduct.resources.map((r) => (
                      <li key={r.id}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                          {r.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-[#FF3B30] dark:text-red-400">Failed to load product details.</p>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#1D1D1F] dark:text-white rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
