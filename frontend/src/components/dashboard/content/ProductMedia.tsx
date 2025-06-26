import React, { useEffect, useState } from "react";
import axios from "axios";
import { getProducts } from "../../../api/products";
import { Product, ProductVariant } from "../../../types/Product.type";

const ProductMedia = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            if (Array.isArray(response)) {
                setProducts(response);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);
  console.log("Fetched products:", products);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col items-center shadow-md rounded-lg p-4 bg-white">
          <img
            src={'http://localhost:8080' +product.thumbnail}
            alt={product.name}
            className="w-32 h-32 object-cover rounded"
          />
          <h2 className="text-center text-sm font-medium mt-2">{product.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductMedia;
