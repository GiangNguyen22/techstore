import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateProductForm = ({ productId=7 }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    companyName: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Lấy product cũ để pre-fill form
    axios.get(`http://localhost:8080/api/products/${productId}`)
      .then(res => {
        setProduct({
          name: res.data.name || "",
          description: res.data.description || "",
          price: res.data.price || "",
          categoryId: res.data.categoryId?.toString() || "", // convert sang string vì <select> value là string
          stockQuantity: res.data.stockQuantity || "",
          companyName: res.data.companyName || ""
        });
        setPreviewUrl(res.data.thumbnail  || null);
      })
      .catch(err => {
        console.error("Error loading product:", err);
      });
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!product.categoryId) {
      alert("Vui lòng chọn Category!");
      return;
    }

    const formData = new FormData();
    if (image) {
      formData.append("file", image);
    }
    formData.append("productDto", new Blob([JSON.stringify(product)], { type: "application/json" }));

    axios.put(`http://localhost:8080/api/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      alert("Product updated successfully!");
      console.log(res.data);
    })
    .catch(err => {
      alert("Error updating product");
      console.error(err);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Update Product</h2>
      <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Product Name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Brand</label>
          <input
            type="text"
            name="companyName"
            value={product.companyName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Company Name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Product Description"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="$1000"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select category</option>
            <option value="1">Laptop</option>
            <option value="2">Camera</option>
            <option value="3">Phụ kiện</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md bg-white"
          />
        </div>

        {previewUrl && (
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Preview</label>
            <div className="w-48 h-48 border rounded-md flex items-center justify-center overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        )}

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
