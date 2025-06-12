import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { getProducts, getProductById } from '../../../api/products'; // Đảm bảo bạn có hàm này


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
      console.log(res);
      console.log(res.productDto);
      setSelectedProduct(res.productDto);
    } catch (err) {
      console.error('Failed to load product details:', err);
      setSelectedProduct(null);
    } finally {
      setLoadingDetail(false);
    }
  };

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
              <th className="py-3 px-4 font-medium text-gray-600">Price</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{product.id}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.price}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'Active'
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
                  <button
                    className="text-blue-500 text-sm hover:underline flex items-center gap-1"
                    onClick={() => handleViewProduct(product.id)}
                  >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>

            {loadingDetail ? (
              <p className="text-gray-500">Loading...</p>
            ) : selectedProduct ? (
              <>
                <img
                  src={selectedProduct.thumbnail}
                  alt="Thumbnail"
                  className="w-32 h-32 object-cover mb-4 rounded"
                />

                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
                <p><strong>Status:</strong> {selectedProduct.status}</p>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                <p><strong>Company:</strong> {selectedProduct.companyName}</p>
                <p><strong>Category ID:</strong> {selectedProduct.categoryId}</p>

                {/* Variants */}
                <div className="mt-4">
                  <p className="font-medium">Variants:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {selectedProduct.variants.map((v) => (
                      <li key={v.id}>
                        {v.color} / {v.size} – Stock: {v.stockQuantity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="mt-4">
                  <p className="font-medium">Resources:</p>
                  <ul className="list-disc list-inside text-sm text-blue-600">
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
              <p className="text-red-500">Failed to load product details.</p>
            )}

            <div className="mt-6 text-right">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
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
