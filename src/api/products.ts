import instance from "./interceptor";

const addProduct = async (product: any): Promise<any> => {
  try {
    const res = await instance.post("/products", product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const uploadImageProduct = async (idProduct: string, image: any): Promise<any> => {
  try {
    const res = await instance.put(
      `/admin/products/${idProduct}/image`,
      image,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const editProduct = async (idProduct: string, product: any): Promise<any> => {
  try {
    const res = await instance.put(`/admin/products/${idProduct}`, product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id: number, product: any): Promise<any> => {
  try {
    const res = await instance.put(`/products/${id}`, product);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id: number): Promise<any> => {
  try {
    const res = await instance.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProducts = async (categoryId?: number): Promise<any> => {
  try {
    const url = categoryId ? `/products?categoryId=${categoryId}` : "/products";
    const res = await instance.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProductSearch = async (keyword: string): Promise<any> => {
  try {
    const res = await instance.get(
      `/public/products/keyword/${keyword}?pageNumber=0&pageSize=5&sortOrder=des`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const searchProducts = async (keyword: string): Promise<any> => {
  try {
    const res = await instance.get(
      `/products/search?keyword=${encodeURIComponent(keyword)}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProductsByCategoryId = async (id: string): Promise<any> => {
  try {
    const res = await instance.get(`/public/categories/${id}/product`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProductsByCategoryIdNew = async (id: string): Promise<any> => {
  try {
    const res = await instance.get(`/public/categories/${id}/product`);
    return res.data.body;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id: number): Promise<any> => {
  try {
    const res = await instance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getAProductByProductId = async (id: string): Promise<any> => {
  try {
    const res = await instance.get(`/public/products/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};



export {
  addProduct,
  getProducts,
  searchProducts,
  getProductsByCategoryId,
  getAProductByProductId,
  editProduct,
  deleteProduct,
  uploadImageProduct,
  getProductsByCategoryIdNew,
  getProductById,
  updateProduct,
  getProductSearch,
};
