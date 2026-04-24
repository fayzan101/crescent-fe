// import React from "react";

// const HeaderButton = ({ title, icon, active = false, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm 
//         transition-all duration-200 ease-in-out
//         flex-shrink-0 
//         ${active 
//           ? "bg-customGreen text-white shadow-sm" 
//           : "bg-white text-customGreen hover:bg-gray-50 border border-gray-200 cursor-pointer"
//         }
//         hover:shadow-md
//       `}
//     >
//       {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
//       <span className="truncate">{title}</span>
//     </button>
//   );
// };

// export default HeaderButton;

import React from "react";

const HeaderButton = ({ title, icon, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center 
        gap-1 sm:gap-1.5 md:gap-2 
        px-2 sm:px-3 md:px-4 
        py-1.5 sm:py-2 
        rounded-lg 
        font-medium 
        text-xs sm:text-sm 
        transition-all duration-200 ease-in-out
        flex-shrink-0 
        whitespace-nowrap
        min-w-0
        ${active 
          ? "bg-customGreen text-white shadow-sm" 
          : "bg-white text-customGreen hover:bg-gray-50 border border-gray-200 cursor-pointer"
        }
        hover:shadow-md
      `}
    >
      {icon && (
        <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="truncate min-w-0">{title}</span>
    </button>
  );
};

export default HeaderButton;