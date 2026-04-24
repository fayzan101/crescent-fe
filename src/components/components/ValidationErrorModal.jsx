import React from "react";
import { AlertCircle } from "lucide-react";

const ValidationErrorModal = ({ isOpen, onClose, missingFields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100/90 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500" size={28} />
          <h2 className="text-lg font-semibold text-gray-800">Validation Error</h2>
        </div>

        <p className="text-gray-700 mb-4">
          Please fill in all required fields:
        </p>

        <ul className="list-disc list-inside mb-6 text-gray-600">
          {missingFields.map((field, index) => (
            <li key={index} className="text-sm mb-1">
              {field}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ValidationErrorModal;
