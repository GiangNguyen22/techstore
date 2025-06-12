import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ProductForm from "./ProductForm";
import { Product } from "../../../../../types/Product.type";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryData: any[]; // rõ hơn là mảng
  product: Product | null;
  formMode: "add" | "edit" | "delete";
  onAdd: (newProduct: any) => Promise<void>;
  onEdit: (updatedProduct: any) => Promise<void>;
  onDelete: (productToDelete: any) => Promise<void>;
}

const ProductModal = ({
  open,
  setOpen,
  categoryData,
  product,
  formMode,
  onAdd,
  onEdit,
  onDelete,
}: ProductModalProps) => {
  function closeModal() {
    setOpen(false);
  }

  // đảm bảo categoryData là mảng, tránh lỗi nếu undefined
  const categories = Array.isArray(categoryData) ? categoryData : [];

  // product thì giữ nguyên, vì có thể null khi add mới

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <ProductForm
                  setOpen={setOpen}
                  categories={categories}
                  product={product}
                  formMode={formMode}
                  onAdd={onAdd}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductModal;
