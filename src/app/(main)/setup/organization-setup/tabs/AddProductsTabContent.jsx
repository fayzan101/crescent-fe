"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useProducts } from "@/hooks/product/useProducts";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import EditModal from "@/components/components/EditModal";
import ViewModal from "@/components/components/ViewModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

const AddProductsTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productName, setProductName] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);

  const { data, isLoading, error, isFetching, isPending, refetch } = useProducts();

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => refetch(),
  });

  const { mutate: updateProduct, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateProduct({
    onSuccess: () => {
      setShowEditModal(false);
      setProductName("");
      setSelectedProduct(null);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateProduct();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Product created successfully" });
      setProductName("");
      setTimeout(() => {
        refetch();
      }, 1000);
    },
  });

  // Sync localProducts with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((product) => ({
        id: product.productId,
        name: product.productName,
        isActive: product.isActive,
      }));
      setLocalProducts(mapped);
    }
  }, [data, isLoading, error]);

  const products = useMemo(() => {
    if (isLoading || error) return [];
    return localProducts;
  }, [localProducts, isLoading, error]);

  const handleCreateProduct = () => {
    if (!productName.trim()) {
      setValidationErrors(["Product Name"]);
      setShowValidationError(true);
      return false;
    }
    createProduct({ productName });
  };

  const handleDeleteProduct = (itemName, index) => {
    if (products[index]?.id) {
      deleteProduct(products[index].id);
    }
  };

  const handleEditProduct = (item) => {
    setSelectedProduct(item);
    setEditProductName(item.name);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (onSuccess) => {
    if (!editProductName.trim()) {
      setValidationErrors(["Product Name"]);
      setShowValidationError(true);
      return;
    }
    if (!selectedProduct) return;
    updateProduct(
      { id: selectedProduct.id, payload: { productName: editProductName } },
      { onSuccess }
    );
  };

  const handleToggleProduct = (item) => {
    if (item?.id) {
      setLocalProducts((prev) =>
        prev.map((product) =>
          product.id === item.id ? { ...product, isActive: !product.isActive } : product
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleViewProduct = (item) => {
    setViewItem(item);
    setShowViewModal(true);
  };

  const resetEditForm = () => {
    setEditProductName("");
  };

  const resetForm = () => {
    setProductName("");
    setSelectedProduct(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEditForm();
    resetUpdateError?.();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewItem(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* SECTION 1: Add Product */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Product Name" required className="text-sm">
              <Input
                placeholder="Type here"
                className="text-sm py-2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Product ID" required className="text-sm">
              <Input
                value="Auto"
                readOnly
                className="text-sm py-2 bg-gray-50"
                placeholder="Auto"
              />
            </FieldWrapper>
          </div>
        </div>

        <FormActions
          onSave={handleCreateProduct}
          onCancel={resetForm}
          tabName="Product"
          isLoading={isCreating}
        />
      </div>

      {/* SECTION 2: Search Item */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching || isPending}
          error={error?.message}
          items={products}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onToggle={handleToggleProduct}
          tabName="Product"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedProduct}
        onUpdate={handleUpdateProduct}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Product"
        itemType="product"
        fields={[
          { label: "Product Name", value: editProductName, onChange: setEditProductName },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Product Details"
        fields={[
          { key: "id", label: "Product ID" },
          { key: "name", label: "Product Name" },
          {
            key: "isActive",
            label: "Status",
            render: (value) => (value ? "Active" : "Inactive"),
          },
        ]}
      />

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        missingFields={validationErrors}
      />

      {/* Success Modal */}
      {/* <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        title="Success"
        message={successModal.message}
      /> */}
    </div>
  );
};

export default AddProductsTabContent;
