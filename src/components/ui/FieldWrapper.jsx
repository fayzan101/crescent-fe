const FieldWrapper = ({ label, required, children, className = "" }) => (
    <div className={`bg-[#E2E6F999] rounded-lg py-0.5 md:py-1 md:pt-2 p-2 md:p-3 flex flex-col gap-0.5 md:gap-0 ${className}`}>
        <label className="text-xs md:text-sm font-light text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

export default FieldWrapper;