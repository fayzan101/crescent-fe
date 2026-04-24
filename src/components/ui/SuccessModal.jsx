const SuccessModal = ({ isOpen, title, message, onClose, type = "create" }) => {
  if (!isOpen) return null;

  const iconColor = type === "create" ? "bg-green-100" : type === "update" ? "bg-blue-100" : "bg-green-100";
  const iconColorText = type === "create" ? "text-green-600" : type === "update" ? "text-blue-600" : "text-green-600";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center`}>
              <svg className={`w-8 h-8 ${iconColorText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title and Message */}
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
          >
            Great!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
