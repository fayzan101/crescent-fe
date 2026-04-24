"use client";

import React, { useState } from "react";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SuccessModal from "@/components/ui/SuccessModal";

const EditModal = ({
  isOpen,
  selectedItem,
  onUpdate,
  onClose,
  isUpdating,
  error,
  title = "Edit Item",
  itemType = "Item",
  fields = [], // Array of { label, value, onChange, type?, options?, readOnly? }
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleUpdateClick = () => {
    onUpdate(() => {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 2000);
    });
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full md:w-2/3 lg:w-1/2 mx-4 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-5 flex-1">
            {/* Render fields from array */}
            {fields && fields.length > 0 ? (
              fields.map((field, index) => (
                <FieldWrapper 
                  key={index} 
                  label={field.label} 
                  className="text-sm"
                >
                  {field.type === "select" ? (
                    <Select
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      options={field.options || []}
                      placeholder={`Select ${field.label}`}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      type={field.type || "text"}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="text-sm"
                      readOnly={field.readOnly}
                    />
                  )}
                </FieldWrapper>
              ))
            ) : (
              <p className="text-gray-500">No fields to edit</p>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateClick}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition shadow-sm hover:shadow-md"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Updated Successfully"
        message={`${itemType} has been updated successfully.`}
        type="update"
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default EditModal;
