"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useVendors } from "@/hooks/vendor/useVendors";
import { useCreateVendor } from "@/hooks/vendor/useCreateVendor";
import { useUpdateVendor } from "@/hooks/vendor/useUpdateVendor";
import { useDeleteVendor } from "@/hooks/vendor/useDeleteVendor";
import { useCities } from "@/hooks/city/useCities";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import EditModal from "@/components/components/EditModal";
import ViewModal from "@/components/components/ViewModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

const VendorsTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [emailId, setEmailId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [primaryMobile, setPrimaryMobile] = useState("");
  const [secondaryMobile, setSecondaryMobile] = useState("");
  const [editVendorName, setEditVendorName] = useState("");
  const [editCityId, setEditCityId] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editEmailId, setEditEmailId] = useState("");
  const [editContactPerson, setEditContactPerson] = useState("");
  const [editPrimaryMobile, setEditPrimaryMobile] = useState("");
  const [editSecondaryMobile, setEditSecondaryMobile] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [localVendors, setLocalVendors] = useState([]);

  const { data, isLoading, error, isFetching, isPending, refetch } =
    useVendors();
  const { data: citiesData } = useCities();

  const { mutate: deleteVendor } = useDeleteVendor({
    onSuccess: () => refetch(),
  });

  const {
    mutate: updateVendor,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateVendor({
    onSuccess: () => {
      resetForm();
      setShowEditModal(false);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateVendor();

  const { mutate: createVendor, isPending: isCreating } = useCreateVendor({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Vendor created successfully" });
      resetForm();
      refetch();
    },
  });

  // Sync localVendors with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((vendor) => {
        const cityName = citiesData?.find((c) => c.cityId === vendor.cityId)?.cityName || "N/A";
        return {
          id: vendor.vendorId,
          name: vendor.vendorName,
          city: cityName,
          contact: vendor.primaryMobile,
          isActive: vendor.isActive,
        };
      });
      setLocalVendors(mapped);
    }
  }, [data, isLoading, error, citiesData]);

  const cityOptions = useMemo(
    () =>
      (citiesData || []).map((city) => ({
        value: city.cityId.toString(),
        label: city.cityName,
      })),
    [citiesData]
  );

  const vendors = useMemo(() => {
    if (isLoading || error) return [];
    return localVendors;
  }, [localVendors, isLoading, error]);

  const resetForm = () => {
    setVendorName("");
    setCityId("");
    setAddress("");
    setEmailId("");
    setContactPerson("");
    setPrimaryMobile("");
    setSecondaryMobile("");
    setSelectedVendor(null);
  };

  const resetEditForm = () => {
    setEditVendorName("");
    setEditCityId("");
    setEditAddress("");
    setEditEmailId("");
    setEditContactPerson("");
    setEditPrimaryMobile("");
    setEditSecondaryMobile("");
  };

  const validateCreateVendor = () => {
    const errors = [];
    if (!vendorName.trim()) errors.push("Vendor Name");
    if (!cityId) errors.push("City");
    if (!address.trim()) errors.push("Address");
    if (!emailId.trim()) errors.push("Email");
    if (!contactPerson.trim()) errors.push("Contact Person");
    if (!primaryMobile.trim()) errors.push("Primary Mobile");
    if (!secondaryMobile.trim()) errors.push("Secondary Mobile");
    return errors;
  };

  const handleCreateVendor = () => {
    const errors = validateCreateVendor();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createVendor({
      vendorName,
      cityId: parseInt(cityId),
      address,
      emailId,
      contactPerson,
      primaryMobile,
      secondaryMobile,
      isActive: true,
    });
  };

  const handleDeleteVendor = (itemName, index) => {
    if (vendors[index]?.id) {
      deleteVendor(vendors[index].id);
    }
  };

  const handleEditVendor = (item) => {
    setSelectedVendor(item);
    setEditVendorName(item.name);
    setEditAddress(item.address || "");
    setEditEmailId(item.emailId || "");
    setEditContactPerson(item.contactPerson || "");
    setEditPrimaryMobile(item.primaryMobile || item.contact || "");
    setEditSecondaryMobile(item.secondaryMobile || "");
    const vendorCity = data?.find((v) => v.vendorId === item.id)?.cityId;
    setEditCityId(vendorCity ? vendorCity.toString() : "");
    setShowEditModal(true);
  };

  const validateUpdateVendor = () => {
    const errors = [];
    if (!editVendorName.trim()) errors.push("Vendor Name");
    if (!editAddress.trim()) errors.push("Address");
    if (!editEmailId.trim()) errors.push("Email");
    if (!editContactPerson.trim()) errors.push("Contact Person");
    if (!editPrimaryMobile.trim()) errors.push("Primary Mobile");
    if (!editSecondaryMobile.trim()) errors.push("Secondary Mobile");
    return errors;
  };

  const handleUpdateVendor = (onSuccess) => {
    const errors = validateUpdateVendor();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }
    if (!selectedVendor) return;
    updateVendor(
      {
        id: selectedVendor.id,
        payload: {
          vendorName: editVendorName,
          cityId: parseInt(editCityId) || null,
          address: editAddress,
          emailId: editEmailId,
          contactPerson: editContactPerson,
          primaryMobile: editPrimaryMobile,
          secondaryMobile: editSecondaryMobile,
        },
      },
      { onSuccess }
    );
  };

  const handleToggleVendor = (item) => {
    if (item?.id) {
      setLocalVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === item.id ? { ...vendor, isActive: !vendor.isActive } : vendor
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleViewVendor = (item) => {
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
      {/* SECTION 1: Add Vendor */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Vendor / Supplier
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Vendor Name" required className="text-sm">
              <Input
                placeholder="Enter vendor name"
                className="text-sm py-2"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="City" required className="text-sm">
              <Select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                placeholder="Select City"
                options={cityOptions}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Address" required className="text-sm">
              <Input
                placeholder="Enter address"
                className="text-sm py-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Email" required className="text-sm">
              <Input
                placeholder="Enter email"
                className="text-sm py-2"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Contact Person" required className="text-sm">
              <Input
                placeholder="Enter contact person name"
                className="text-sm py-2"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Primary Mobile" required className="text-sm">
              <Input
                placeholder="Enter primary mobile"
                className="text-sm py-2"
                value={primaryMobile}
                onChange={(e) => setPrimaryMobile(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Secondary Mobile" required className="text-sm">
              <Input
                placeholder="Enter secondary mobile"
                className="text-sm py-2"
                value={secondaryMobile}
                onChange={(e) => setSecondaryMobile(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Vendor ID" className="text-sm">
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
          onSave={handleCreateVendor}
          onCancel={resetForm}
          tabName="Vendor"
          isLoading={isCreating}
          showAutoSuccess={false}
        />
      </div>

      {/* SECTION 2: Search Item */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching || isPending}
          error={error?.message}
          items={vendors}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewVendor}
          onEdit={handleEditVendor}
          onDelete={handleDeleteVendor}
          onToggle={handleToggleVendor}
          tabName="Vendor"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedVendor}
        onUpdate={handleUpdateVendor}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Vendor"
        itemType="vendor"
        fields={[
          { label: "Vendor Name", value: editVendorName, onChange: setEditVendorName },
          { label: "City", value: editCityId, onChange: setEditCityId, type: "select", options: cityOptions },
          { label: "Address", value: editAddress, onChange: setEditAddress },
          { label: "Email", value: editEmailId, onChange: setEditEmailId },
          { label: "Contact Person", value: editContactPerson, onChange: setEditContactPerson },
          { label: "Primary Mobile", value: editPrimaryMobile, onChange: setEditPrimaryMobile },
          { label: "Secondary Mobile", value: editSecondaryMobile, onChange: setEditSecondaryMobile },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Vendor Details"
        fields={[
          { key: "id", label: "Vendor ID" },
          { key: "name", label: "Vendor Name" },
          { key: "city", label: "City" },
          { key: "contact", label: "Primary Contact" },
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

export default VendorsTabContent;
