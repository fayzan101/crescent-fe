import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const Select = ({ 
  placeholder, 
  value, 
  onChange, 
  options = [],
  className = "",
  disabled = false,
  name = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Always compare as string for value matching
  const selectedLabel = options.find(opt => String(opt.value) === String(value))?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {

    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-h-10 flex items-center justify-between py-2  rounded-lg transition-colors ${
          disabled 
            ? "text-gray-500 cursor-not-allowed" 
            : "text-gray-700 hover:border-gray-400 cursor-pointer"
        }`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <FiChevronDown 
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-0 z-50 max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={value===option.value && disabled}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2  hover:bg-[#E2E6F9] hover:text-black transition-colors ${
                  value === option.value 
                    ? "bg-blue-100 font-medium text-black cursor-not-allowed" 
                    : "text-white  cursor-pointer bg-customPurple"
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;