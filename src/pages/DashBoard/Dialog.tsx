import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { setIdSelected, setOpenDialog } from "../../reducer/dialog.reducer";
import {
  createCategory,
  deleteCategory as deleteCategoryApi,
  getCategoryById,
  updateCategory,
  uploadImageCategory,
} from "../../api/categories";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Dialog = () => {
  const dispatch = useDispatch();
  const idSelected = useSelector((state: RootState) => state.dialog.idSelected);
  const typeDialog = useSelector((state: RootState) => state.dialog.typeDialog);
  const [name, setName] = useState<string>(""); // State to hold the category name
  console.log(name);
  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: any) => await deleteCategoryApi(categoryId),
    onSuccess: () => {
      toast.success("Xoá thành công");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (user: any) => await updateCategory(user),
    onSuccess: () => {
      toast.success("Sửa thành công");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async ({ name }: any) => await createCategory(name),
    onSuccess: () => {
      toast.success("Tạo thành công");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error: any) => {
      toast.error(error.body);
    },
  });

  const uploadImageCategoryMutation = useMutation({
    mutationFn: async ({
      idCategory,
      image,
    }: {
      idCategory: string;
      image: any;
    }) => {
      return await uploadImageCategory(idCategory, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting cart item:", error);
      // You might want to show a toast or error message to user here
    },
  });

  // Fetch the category by id
  const { data, isLoading, error } = useQuery({
    queryKey: ["category", idSelected],
    queryFn: async () => await getCategoryById(idSelected),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (typeDialog === "edit") {
      if (data?.body) {
        setName(data.body.name);
      }
    }
  }, [data, typeDialog]);

  // If loading, return loading message
  if (isLoading) {
    return <p>Loading ...</p>;
  }

  const handleClick = () => {
    if (typeDialog === "delete") {
      deleteCategoryMutation.mutate(idSelected);
      dispatch(setIdSelected(""));
      dispatch(setOpenDialog(false));
    } else if (typeDialog === "edit") {
      console.log(idSelected);
      updateCategoryMutation.mutate({ name: name, categoryId: idSelected });
      dispatch(setIdSelected(""));
      dispatch(setOpenDialog(false));
    } else if (typeDialog === "create") {
      createCategoryMutation.mutate({ name: name });
      dispatch(setOpenDialog(false));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // console.log(file);

    if (file) {
      const image = new FormData();
      image.append("image", file);

      uploadImageCategoryMutation.mutate({ idCategory: idSelected, image });
    } else {
      console.error("No file selected");
    }
  };

  // Hàm xử lý khi nhấn phím Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick(); // Gọi handleClick khi nhấn Enter
    }
  };

  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      {typeDialog === "delete" && " Chú ý"}
                      {typeDialog === "edit" && "Sửa"}
                      {typeDialog === "create" && "Thêm Category"}
                    </h3>
                    <div className="mt-2">
                      {typeDialog === "delete" && (
                        <p className="text-sm text-gray-500">
                          Bạn có chắc chắn muốn xoá không ?
                        </p>
                      )}
                      {typeDialog === "edit" && (
                        <div className="flex flex-col gap-2">
                          <label htmlFor="categoryName">Name: </label>
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            id="categoryName"
                            className="border border-gray-900 rounded-lg py-2 px-4"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Allow editing
                            onKeyDown={handleKeyDown} // Lắng nghe sự kiện phím Enter
                          />
                        </div>
                      )}
                      {typeDialog === "create" && (
                        <div className="flex flex-col gap-2">
                          <label htmlFor="categoryName">Name: </label>
                          <input
                            id="categoryName"
                            className="border border-gray-900 rounded-lg py-2 px-4"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Allow editing
                            onKeyDown={handleKeyDown} // Lắng nghe sự kiện phím Enter
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleClick}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {typeDialog === "delete" ? "Xoá" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setOpenDialog(false))}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dialog;
