import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

const SearchableSelect = ({
  placeholder,
  value,
  onChange,
  options = [],
  className = "",
  disabled = false,
  name = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => String(option.label || "").toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    setQuery(selectedOption?.label || "");
  }, [isOpen, selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue, optionLabel) => {
    onChange({ target: { name, value: optionValue } });
    setQuery(optionLabel || "");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full min-h-10 flex items-center justify-between py-2 rounded-lg transition-colors ${
          disabled ? "text-gray-500 cursor-not-allowed" : "text-gray-700 hover:border-gray-400 cursor-pointer"
        }`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <FiChevronDown className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full right-0 left-0 mt-1 z-50 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full border-0 p-0 text-sm text-gray-900 outline-none focus:ring-0"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value, option.label)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#E2E6F9] hover:text-black ${
                    String(value) === String(option.value)
                      ? "bg-blue-100 font-medium text-black"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;