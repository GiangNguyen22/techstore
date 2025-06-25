import instance from "./interceptor";

const getCategories = async (): Promise<any> => {
  try {
    const res = await instance.get("/category");
    return res.data;
  } catch (error: any) {
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
    throw error;
  }
};



const getCategoryById = async (id: string): Promise<any> => {
  try {
    const res = await instance.get(`/public/categories/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createCategory = async (name: string): Promise<any> => {
  try {
    const res = await instance.post("/category", { name });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

const updateCategory = async (user: { categoryId: number; name: string }): Promise<any> => {
  try {
    const res = await instance.put(`/category/${user.categoryId}`, {
      name: user.name,
    });
    return res.data;
  } catch (error) {
    console.log("Update error:", error);
    throw error;
  }
};

const uploadImageCategory = async (idCategory: string, image: any): Promise<any> => {
  try {
    const res = await instance.put(
      `/admin/categories/${idCategory}/image`,
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

const deleteCategory = async (id: string): Promise<any> => {
  try {
    const res = await instance.delete(`/category/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  uploadImageCategory,
};
