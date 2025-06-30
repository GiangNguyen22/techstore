import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../api/products";
import { FiSearch } from "react-icons/fi";

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
          className="block w-full py-2.5 pr-12 pl-5 text-gray-800 border border-gray-300 
                     rounded-full bg-white shadow-sm focus:ring-2 focus:ring-orange-400 
                     focus:outline-none focus:border-orange-500 transition duration-300"
          placeholder="Tìm kiếm sản phẩm..."
          required
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition"
          aria-label="Search"
        >
          <FiSearch size={20} />
        </button>
      </div>
    </div>
  </form>

  {/* Gợi ý sản phẩm */}
  {suggestions.length > 0 && (
    <ul
      className="absolute w-full max-w-[700px] mx-auto left-0 right-0 mt-1 
                 border border-orange-300 shadow-lg rounded-xl z-10 
                 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 
                 scrollbar-track-orange-100 bg-white transition-all duration-300"
    >
      {isFetching && (
        <li className="px-4 py-2 text-orange-400 font-medium animate-pulse">
          Đang tìm kiếm...
        </li>
      )}
      {suggestions.slice(0, 5).map((product) => (
        <li
          key={product.id}
          className="flex justify-between items-center px-4 py-3 hover:bg-orange-50 
                     cursor-pointer border-b border-gray-100 transition"
          onClick={() => handleSelectProduct(product.id, product.name)}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{product.name}</span>
            <span className="text-sm text-orange-500 font-medium">
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
            className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
          />
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default InputSearch;
