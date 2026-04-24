"use client";

import React, { useMemo, useState, useEffect } from "react";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import { useOffices } from "@/hooks/office/useOffices";
import { useDeleteOffice } from "@/hooks/office/useDeleteOffice";
import { useUpdateOffice } from "@/hooks/office/useUpdateOffice";
import { useCreateOffice } from "@/hooks/office/useCreateOffice";
import EditModal from "@/components/components/EditModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";

const AddOfficeTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [editOfficeName, setEditOfficeName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [localOffices, setLocalOffices] = useState([]);
  
  const { data, isLoading, error, isFetching, isPending, refetch } = useOffices();
  
  const { mutate: deleteOffice, isPending: isDeleting } = useDeleteOffice({
    onSuccess: () => {
      refetch();
    },
  });
  
  const { mutate: updateOffice, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateOffice({
    onSuccess: () => {
      setShowEditModal(false);
      setOfficeName("");
      setSelectedOffice(null);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateOffice();
  // Toggle mutation without refetch - just API call
  
  const { mutate: createOffice, isPending: isCreating } = useCreateOffice({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Office created successfully" });
      setOfficeName("");
      refetch();
    },
  });

  // Sync localOffices with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((office) => ({
        id: office.officeId,
        name: office.officeName,
        isActive: office.isActive,
      }));
      setLocalOffices(mapped);
    }
  }, [data, isLoading, error]);

  const offices = useMemo(() => {
    if (isLoading || error) return [];
    return localOffices;
  }, [localOffices, isLoading, error]);

  const handleCreateOffice = () => {
    if (!officeName.trim()) {
      setValidationErrors(["Office Name"]);
      setShowValidationError(true);
      return false;
    }
    createOffice({ officeName });
  };

  const resetEditForm = () => {
    setEditOfficeName("");
  };

  const resetForm = () => {
    setOfficeName("");
    setSelectedOffice(null);
  };

  const handleEditOffice = (item) => {
    setSelectedOffice(item);
    setEditOfficeName(item.name);
    setShowEditModal(true);
  };

  const handleUpdateOffice = (onSuccess) => {
    if (!editOfficeName.trim()) {
      setValidationErrors(["Office Name"]);
      setShowValidationError(true);
      return;
    }
    if (!selectedOffice) return;
    updateOffice(
      { id: selectedOffice.id, payload: { officeName: editOfficeName } },
      { onSuccess }
    );
  };

  const handleToggleOffice = (item) => {
    if (item?.id) {
      // Update local state immediately for instant UI feedback
      setLocalOffices((prev) =>
        prev.map((office) =>
          office.id === item.id ? { ...office, isActive: !office.isActive } : office
        )
      );
      // Call API in background without refetch
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleDeleteOffice = (itemName, index) => {
    if (offices[index]?.id) {
      deleteOffice(offices[index].id);
    }
  };


  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEditForm();
    resetUpdateError?.();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* SECTION 1: Add Office */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Office
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Office Name" required className="text-sm">
              <Input
                placeholder="Type here"
                className="text-sm py-2"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
              />
            </FieldWrapper>
          </div>
          
          <div className="space-y-1">
            <FieldWrapper label="Account ID" required className="text-sm">
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
          onSave={handleCreateOffice}
          onCancel={resetForm}
          tabName="Office"
          isLoading={isCreating}
          showAutoSuccess={false}
        />
      </div>
      
      {/* SECTION 2: Search Item */}
      <div className=" pb-6 md:pb-8">
        
        <SearchList
          isLoading={isLoading || isFetching || isPending}
          error={error?.message}
          items={offices}
          showView={false}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onEdit={handleEditOffice}
          onDelete={handleDeleteOffice}
          onToggle={handleToggleOffice}
          tabName="Office"
        />
      </div>

      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedOffice}
        onUpdate={handleUpdateOffice}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Office"
        itemType="office"
        fields={[
          { label: "Office Name", value: editOfficeName, onChange: setEditOfficeName },
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

export default AddOfficeTabContent;
