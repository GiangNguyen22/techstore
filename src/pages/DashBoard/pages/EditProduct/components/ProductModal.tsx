// ProductModal.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ProductForm from "./ProductForm";
import { Product } from "../../../../../types/Product.type";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryData: any[];
  product: Product | null;
  formMode: "add" | "edit" | "delete";

  onSubmit: (
    mode: "add" | "edit" | "delete",
    productData: any
  ) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  setOpen,
  categoryData,
  product,
  formMode,
  onSubmit,
}) => {
  const closeModal = () => setOpen(false);
  const categories = Array.isArray(categoryData) ? categoryData : [];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        {/* Overlay */}
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

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-[80vh] items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden 
              rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <ProductForm
                  setOpen={setOpen}
                  categories={categories}
                  product={product}
                  formMode={formMode}
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
