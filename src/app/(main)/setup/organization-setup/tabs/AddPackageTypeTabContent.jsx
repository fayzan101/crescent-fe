"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePackages } from "@/hooks/package/usePackages";
import { useCreatePackage } from "@/hooks/package/useCreatePackage";
import { useUpdatePackage } from "@/hooks/package/useUpdatePackage";
import { useDeletePackage } from "@/hooks/package/useDeletePackage";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import EditModal from "@/components/components/EditModal";
import ViewModal from "@/components/components/ViewModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

const PackageTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [packageName, setPackageName] = useState("");
  const [minCharges, setMinCharges] = useState("");
  const [minRenewalCharges, setMinRenewalCharges] = useState("");
  const [editPackageName, setEditPackageName] = useState("");
  const [editMinCharges, setEditMinCharges] = useState("");
  const [editMinRenewalCharges, setEditMinRenewalCharges] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [localPackages, setLocalPackages] = useState([]);

  const { data, isLoading, error, isFetching, isPending, refetch } =
    usePackages();

  const { mutate: deletePackage } = useDeletePackage({
    onSuccess: () => refetch(),
  });

  const {
    mutate: updatePackage,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdatePackage({
    onSuccess: () => {
      resetForm();
      setShowEditModal(false);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdatePackage();

  const { mutate: createPackage, isPending: isCreating } = useCreatePackage({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Package created successfully" });
      resetForm();
      refetch();
    },
  });

  // Sync localPackages with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((pkg) => ({
        id: pkg.packageId,
        name: pkg.packageName,
        minCharges: pkg.minCharges,
        minRenewalCharges: pkg.minRenewalCharges,
        isActive: pkg.isActive,
      }));
      setLocalPackages(mapped);
    }
  }, [data, isLoading, error]);

  const packages = useMemo(() => {
    if (isLoading || error) return [];
    return localPackages;
  }, [localPackages, isLoading, error]);

  const resetForm = () => {
    setPackageName("");
    setMinCharges("");
    setMinRenewalCharges("");
    setSelectedPackage(null);
  };

  const resetEditForm = () => {
    setEditPackageName("");
    setEditMinCharges("");
    setEditMinRenewalCharges("");
  };

  const validateCreatePackage = () => {
    const errors = [];
    if (!packageName.trim()) errors.push("Package Name");
    if (!minCharges) errors.push("Min Charges");
    if (!minRenewalCharges) errors.push("Min Renewal Charges");
    return errors;
  };

  const handleCreatePackage = () => {
    const errors = validateCreatePackage();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createPackage({
      packageName,
      minCharges: parseFloat(minCharges),
      minRenewalCharges: parseFloat(minRenewalCharges),
      isActive: true,
    });
  };

  const handleDeletePackage = (itemName, index) => {
    if (packages[index]?.id) {
      deletePackage(packages[index].id);
    }
  };

  const handleEditPackage = (item) => {
    setSelectedPackage(item);
    setEditPackageName(item.name);
    setEditMinCharges(item.minCharges.toString());
    setEditMinRenewalCharges(item.minRenewalCharges.toString());
    setShowEditModal(true);
  };

  const validateUpdatePackage = () => {
    const errors = [];
    if (!editPackageName.trim()) errors.push("Package Name");
    if (!editMinCharges) errors.push("Min Charges");
    if (!editMinRenewalCharges) errors.push("Min Renewal Charges");
    return errors;
  };

  const handleUpdatePackage = (onSuccess) => {
    const errors = validateUpdatePackage();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }
    if (!selectedPackage) return;
    updatePackage(
      {
        id: selectedPackage.id,
        payload: {
          packageName: editPackageName,
          minCharges: parseFloat(editMinCharges),
          minRenewalCharges: parseFloat(editMinRenewalCharges),
        },
      },
      { onSuccess }
    );
  };

  const handleTogglePackage = (item) => {
    if (item?.id) {
      setLocalPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === item.id ? { ...pkg, isActive: !pkg.isActive } : pkg
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleViewPackage = (item) => {
    setViewItem(item);
    setShowViewModal(true);
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
      {/* SECTION 1: Add Package */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Package
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Package Name" required className="text-sm">
              <Input
                placeholder="Enter package name"
                className="text-sm py-2"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Min Charges" required className="text-sm">
              <Input
                placeholder="Enter minimum charges"
                className="text-sm py-2"
                type="number"
                step="0.01"
                value={minCharges}
                onChange={(e) => setMinCharges(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Min Renewal Charges" required className="text-sm">
              <Input
                placeholder="Enter minimum renewal charges"
                className="text-sm py-2"
                type="number"
                step="0.01"
                value={minRenewalCharges}
                onChange={(e) => setMinRenewalCharges(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Package ID" className="text-sm">
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
          onSave={handleCreatePackage}
          onCancel={resetForm}
          tabName="Package"
          isLoading={isCreating}
          showAutoSuccess={false}
        />
      </div>

      {/* SECTION 2: Search Item */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching || isPending}
          error={error?.message}
          items={packages}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewPackage}
          onEdit={handleEditPackage}
          onDelete={handleDeletePackage}
          onToggle={handleTogglePackage}
          tabName="Package"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedPackage}
        onUpdate={handleUpdatePackage}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Package"
        itemType="package"
        fields={[
          { label: "Package Name", value: editPackageName, onChange: setEditPackageName },
          { label: "Min Charges", value: editMinCharges, onChange: setEditMinCharges, type: "number" },
          { label: "Min Renewal Charges", value: editMinRenewalCharges, onChange: setEditMinRenewalCharges, type: "number" },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Package Details"
        fields={[
          { key: "id", label: "Package ID" },
          { key: "name", label: "Package Name" },
          { key: "minCharges", label: "Min Charges" },
          { key: "minRenewalCharges", label: "Min Renewal Charges" },
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
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        title="Success"
        message={successModal.message}
      />
    </div>
  );
};

export default PackageTabContent;
