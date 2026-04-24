"use client";

import React from "react";

const ViewModal = ({
  isOpen,
  item,
  onClose,
  title = "Item Details",
  fields = [],
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full md:w-2/3 lg:w-1/2 mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                {field.label}
              </p>
              <p className="text-base text-gray-900 font-medium">
                {field.render
                  ? field.render(item[field.key])
                  : item[field.key]?.toString() || "N/A"}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-sm hover:shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewModal;
