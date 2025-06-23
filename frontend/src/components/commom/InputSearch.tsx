import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../api/products";

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
  image: string;
}

const InputSearch = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [debouncedText, setDebouncedText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedText(text);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [text]);

  const { data, isFetching } = useQuery({
    queryKey: ["searchProducts", debouncedText],
    queryFn: () => searchProducts(debouncedText),
    enabled: debouncedText.length > 0,
    staleTime: 1000 * 60,
  });
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    // console.log(data);
    if (data && Array.isArray(data)) {
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  }, [data]);

  const handleSelectProduct = (id: number, name: string) => {
    navigate(`/product/${id}`, { state: { productId: id }, replace: true });
    setText("");
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?keyword=${text}`);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setIsSearching(e.target.value.length > 0);
  };
  const BACKEND_URL = "http://localhost:8080";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="relative flex">
          <div className="relative w-full max-w-[700px] mx-auto">
            <input
              value={text}
              onChange={handleInputChange}
              type="search"
              className="block w-full p-3 pr-12 pl-4 text-gray-900 border border-orange-400 rounded-xl bg-white shadow-md
                   focus:ring-2 focus:ring-orange-400 focus:border-orange-500 outline-none transition duration-300"
              placeholder="Tìm kiếm sản phẩm..."
              required
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-xl hover:text-orange-700 transition"
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </div>
      </form>

      {/* Danh sách gợi ý  */}
      {suggestions.length > 0 && (
        <ul
          className="absolute w-full max-w-[700px] mx-auto left-0 right-0 border border-orange-400 shadow-lg rounded-xl
               z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100
               bg-[#FFF8F0] transition-all duration-300"
        >
          {isFetching && (
            <li className="px-4 py-2 text-orange-400 font-medium animate-pulse">
              Đang tìm kiếm...
            </li>
          )}
          {suggestions.slice(0, 5).map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center px-4 py-3 hover:bg-orange-100 cursor-pointer border-b border-orange-200
                   transition-colors duration-200"
              onClick={() => handleSelectProduct(product.id, product.name)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-orange-700">
                  {product.name}
                </span>
                <span className="font-semibold text-orange-700">
                  {product.price.toLocaleString()}₫
                </span>
              </div>
              <img
                src={
                  product.thumbnail
                    ? BACKEND_URL + product.thumbnail
                    : product.image
                }
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg shadow-sm border border-orange-200"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSearch;
