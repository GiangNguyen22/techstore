// FE chính xác tương ứng với ProductController
import instance from "./interceptor";

// Thêm sản phẩm (JSON)
const addProduct = async (product: any): Promise<any> => {
  try {
    const res = await instance.post("/products", product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
const updateProduct = async (id: number, product: any): Promise<any> => {
  try {
    const res = await instance.put(`/products/${id}`, product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
const deleteProduct = async (id: number): Promise<any> => {
  try {
    const res = await instance.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Upload thumbnail riêng
const uploadThumbnail = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await instance.post("/products/upload-thumbnail", formData);
    return res.data; // Trả về URL ảnh
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách sản phẩm (có lọc categoryId)
const getProducts = async (categoryId?: number): Promise<any> => {
  const url = categoryId ? `/products?categoryId=${categoryId}` : "/products";
  const res = await instance.get(url);
  return res.data;
};

// Lọc theo khoảng giá
const filterProductsByPrice = async (minPrice?: number, maxPrice?: number): Promise<any> => {
  const url = `/products/filter?minPrice=${minPrice || ""}&maxPrice=${maxPrice || ""}`;
  const res = await instance.get(url);
  return res.data;
};

// Lấy top sản phẩm bán chạy
const getTopSellingProducts = async (): Promise<any> => {
  const res = await instance.get("/products/best-selling");
  return res.data;
};

// Tìm kiếm nâng cao
const searchProducts = async (keyword: string): Promise<any> => {
  console.log("Searching keyword:", keyword);
  const res = await instance.get(`/products/search?keyword=${encodeURIComponent(keyword)}`);
  console.log("Response data:", res.data);
  return res.data;
};

// Lấy chi tiết 1 sản phẩm
const getProductById = async (id: number): Promise<any> => {
  const res = await instance.get(`/products/${id}`);
  return res.data;
};



export {
  addProduct,
  updateProduct,
  deleteProduct,
  uploadThumbnail,
  getProducts,
  filterProductsByPrice,
  getTopSellingProducts,
  searchProducts,
  getProductById,
};
