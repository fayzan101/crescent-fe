import React from "react";

const ProvinceStatsCard = ({
  provinceName,
  clients,
  vehicles,
  Icon,
  bgClass = "bg-gradient-to-r from-pink-500 to-pink-600",
}) => {
  return (
    <div
      className="
        w-full
        min-w-[220px]
        max-w-[260px]
        h-[140px]
        rounded-2xl
        shadow-md
        bg-white
        border border-gray-100
        p-4
        flex
        flex-col
        justify-between
        transition
        hover:shadow-lg
      "
    >
      {/* Top Section */}
      <div className={`flex items-center justify-between p-3 rounded-xl text-white ${bgClass}`}>
        <h3 className="text-sm font-semibold tracking-wide">
          {provinceName}
        </h3>

        {Icon && (
          <div className="text-xl opacity-90">
            <Icon />
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex justify-between mt-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">Clients</p>
          <p className="text-lg font-semibold text-gray-800">
            {clients}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">Vehicles</p>
          <p className="text-lg font-semibold text-gray-800">
            {vehicles}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProvinceStatsCard;
