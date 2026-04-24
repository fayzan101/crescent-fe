"use client";

import { Eye, Pencil, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

const FormButton = ({
  theme = "primary",
  text,
  onClick,
  type = "button",
  className = "",
}) => {
  const base = "w-40 py-3.5 rounded-lg text-md font-medium transition cursor-pointer";
  const themeClass =
    theme === "primary"
      ? "bg-customPurple text-white hover:bg-customPurple/90"
      : theme === "cancel"
        ? "border border-customPurple text-customPurple hover:bg-gray-50"
        : "bg-gray-200 text-gray-700";

  return (
    <button type={type} onClick={onClick} className={`${base} ${themeClass} ${className}`}>
      {text}
    </button>
  );
};

const ViewButton = ({ onClick }) => (
  <button
    className="rounded-lg bg-[#FEB000] p-2 px-3 text-white transition hover:bg-[#FEB000]/80 cursor-pointer"
    onClick={onClick}
  >
    <Eye className="w-4 h-4" />
  </button>
);

const EditButton = ({ onClick }) => (
  <button
    className="rounded-lg bg-[#006EC4] p-2 px-3 text-white transition hover:bg-[#006EC4]/80 cursor-pointer"
    onClick={onClick}
  >
    <Pencil className="w-4 h-4" />
  </button>
);

const DeleteButton = ({ onClick }) => (
  <button
    className="rounded-lg bg-[#E03137] p-2 px-3 text-white transition hover:bg-[#E03137]/80 cursor-pointer"
    onClick={onClick}
  >
    <Trash2 className="w-4 h-4" />
  </button>
);

const ToggleButton = ({ onClick, isActive = true }) => (
  <button
    className={`rounded-lg p-2 px-3 text-white transition cursor-pointer ${
      isActive ? "bg-[#03A12B] hover:bg-[#03A12B]/80" : "bg-gray-400 hover:bg-gray-500"
    }`}
    onClick={onClick}
  >
    {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
  </button>
);

export { FormButton, ViewButton, EditButton, DeleteButton, ToggleButton };
