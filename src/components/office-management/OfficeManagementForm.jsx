"use client";

import React, { useState } from "react";
import FieldWrapper from "../ui/FieldWrapper";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/TextArea";
import DateInput from "../ui/DateInput";
import { FiEdit, FiEye, FiMoreVertical, FiTrash2 } from "react-icons/fi";

// Office Management Component
const OfficeManagementForm = () => {
  const [activeTab, setActiveTab] = useState("addOffice");

  const tabs = [
    { key: "addOffice", label: "Add Office" },
    { key: "sales", label: "Sales" },
    { key: "clients", label: "Clients" },
    { key: "accounts", label: "Accounts" },
    { key: "operations", label: "Operations" },
    { key: "installation", label: "Installation" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 min-h-[500px]">
      {/* Left tabs - vertical on desktop */}
      <div className="flex flex-col items-stretch gap-2 md:gap-3 md:w-48 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              w-full px-4 py-3 text-sm md:text-base 
              flex items-center justify-center rounded-lg transition-all duration-200
              whitespace-normal text-center min-h-[48px] md:min-h-[56px]
              ${activeTab === tab.key 
                ? "bg-customGreen text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0">
        {activeTab === "addOffice" && <AddOfficeTabContent />}
        {activeTab === "sales" && <SalesTabContent />}
        {activeTab === "clients" && <ClientsTabContent />}
        {activeTab === "accounts" && <AccountsTabContent />}
        {activeTab === "operations" && <OperationsTabContent />}
        {activeTab === "installation" && <InstallationTabContent />}
      </div>
    </div>
  );
};

// 1. Add Office Tab Content
const AddOfficeTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10">
      
      {/* SECTION 1: Add Office */}
      <div className="border-b pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Office
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Office Name Field */}
          <div className="space-y-1">
            <FieldWrapper label="Office Name" className="text-sm">
              <Input placeholder="Type here" className="text-sm py-2" />
            </FieldWrapper>
          </div>
          
          {/* Account ID Field */}
          <div className="space-y-1">
            <FieldWrapper label="Account ID" className="text-sm">
              <Input 
                value="Auto" 
                readOnly 
                className="text-sm py-2 bg-gray-50"
              />
            </FieldWrapper>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 pt-6 md:pt-8 mt-4 md:mt-6">
          <button className="w-24 border border-gray-400 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button className="w-24 bg-customGreen text-white py-2 rounded text-sm font-medium hover:bg-customGreen/90 transition">
            Save
          </button>
        </div>
      </div>
      
      {/* SECTION 2: Search Item */}
      <div className="border-b pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Search Item
        </h2>
        
<div className="space-y-2">
  {[
    "ABC Traders",
    "ABC Technologies",
    "Computer Zone",
    "Service Provider",
  ].map((item, index) => (
    <div
      key={index}
      className="
        flex items-center justify-between
        px-4 py-3
        bg-[#F6FBF8]
        rounded-lg
        hover:bg-[#EEF6F2]
        transition
      "
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Index Bubble */}
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
          {index + 1}
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-gray-800">
          {item}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
          <FiEye className="w-4 h-4" />
        </button>

        <button className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
          <FiEdit className="w-4 h-4" />
        </button>

        <button className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200">
          <FiTrash2 className="w-4 h-4" />
        </button>

        <button className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200">
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  ))}
</div>

      </div>
      
      {/* SECTION 3: Clients Category */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Clients Category
        </h2>
        
        <div className="flex items-center justify-center h-32 md:h-40">
          <button className="bg-customBlue text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-customBlue/90 transition flex items-center gap-2">
            <span>+</span>
            <span>Add Packages Type</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

// 2. Sales Tab Content
const SalesTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-3 md:gap-4">
      {/* Heading */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Sales
      </h2>

      {/* Form Grid - 2 columns on medium and large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Column 1 - Client Information */}
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Select Client Category" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Select IR No." className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Full Name" className="text-sm">
            <Input placeholder="12345-1234567-1" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="CNIC No." className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Phone Home" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Email ID" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Address" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
        </div>

        {/* Column 2 - Client Details */}
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Select Client Status" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Cell No." className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Father Name" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Date of Birth" className="text-sm">
            <DateInput placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Phone Office" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>

          <FieldWrapper label="Company/ Department" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Address Line 2" className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
        </div>
      </div>

      {/* Product & Package Section */}
      <div className="mt-4 md:mt-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
          Select Product & Package
        </h2>

        {/* Product Grid - 2 columns on medium and large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* Column 1 */}
          <div className="flex flex-col gap-3 md:gap-3">
            <FieldWrapper label="Select Product" required className="text-sm">
              <Select placeholder="Select" className="text-sm py-2" />
            </FieldWrapper>
            
            <FieldWrapper label="Sale Amount" required className="text-sm">
              <Input placeholder="Type (10000) numeric only" className="text-sm py-2" />
            </FieldWrapper>
            
            <FieldWrapper label="Sale Type" required className="text-sm">
              <Input placeholder="Type here (credit/ Cash/ Cheque/ Transfer)" className="text-sm py-2" />
            </FieldWrapper>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3 md:gap-3">
            <FieldWrapper label="Select Package Type" required className="text-sm">
              <Select placeholder="Select" className="text-sm py-2" />
            </FieldWrapper>

            <FieldWrapper label="Renewal Charges" required className="text-sm">
              <Input placeholder="Type (8000) numeric only" className="text-sm py-2" />
            </FieldWrapper>

            <FieldWrapper label="Sales Remarks" className="text-sm">
              <Textarea 
                placeholder="Type here" 
                className="min-h-[60px] md:min-h-[80px] text-sm"
              />
            </FieldWrapper>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mt-6 md:mt-8">
        {/* Credit Check Button */}
        <button
          className="
            w-full md:w-auto
            border border-customBlue
            text-customBlue
            px-4 py-2
            rounded-lg
            cursor-pointer
            text-sm font-medium
            transition
            hover:bg-customBlue/10
          "
        >
          Credit Check
        </button>
        
        {/* Cancel & Save Buttons */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <button
            className="
              w-full md:w-32
              border border-customBlue
              text-customBlue
              px-4 py-2
              rounded-lg
              cursor-pointer
              text-sm font-medium
              transition
              hover:bg-customBlue/10
            "
          >
            Cancel
          </button>

          <button
            className="
              w-full md:w-32
              bg-customBlue
              text-gray-100
              px-4 py-2
              rounded-lg
              cursor-pointer
              text-sm font-medium
              transition
              hover:bg-customBlue/90
            "
          >
            Save & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Clients Tab Content
const ClientsTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Clients Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Client Name" required className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Client ID" className="text-sm">
            <Input placeholder="Auto" className="text-sm py-2 bg-gray-50" readOnly />
          </FieldWrapper>
        </div>
        
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Client Type" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Status" className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
        </div>
      </div>
      
      <div className="flex gap-3 pt-6">
        <button className="w-24 border border-gray-400 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="w-24 bg-customBlue text-white py-2 rounded text-sm font-medium hover:bg-customBlue/90 transition">
          Save
        </button>
      </div>
    </div>
  );
};

// 4. Accounts Tab Content
const AccountsTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Accounts Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Account Name" required className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Account Type" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
        </div>
        
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Balance" className="text-sm">
            <Input placeholder="0.00" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Currency" className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
        </div>
      </div>
      
      <div className="flex gap-3 pt-6">
        <button className="w-24 border border-gray-400 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="w-24 bg-customBlue text-white py-2 rounded text-sm font-medium hover:bg-customBlue/90 transition">
          Save
        </button>
      </div>
    </div>
  );
};

// 5. Operations Tab Content
const OperationsTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Operations Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Operation Type" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Start Date" required className="text-sm">
            <DateInput placeholder="Select date" className="text-sm py-2" />
          </FieldWrapper>
        </div>
        
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Status" className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="End Date" className="text-sm">
            <DateInput placeholder="Select date" className="text-sm py-2" />
          </FieldWrapper>
        </div>
      </div>
      
      <div className="flex gap-3 pt-6">
        <button className="w-24 border border-gray-400 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="w-24 bg-customBlue text-white py-2 rounded text-sm font-medium hover:bg-customBlue/90 transition">
          Save
        </button>
      </div>
    </div>
  );
};

// 6. Installation Tab Content
const InstallationTabContent = () => {
  return (
    <div className="flex-1 flex flex-col gap-4 md:gap-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800">
        Installation Management
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Installation Type" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Technician" required className="text-sm">
            <Select placeholder="Select" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Installation Date" required className="text-sm">
            <DateInput placeholder="Select date" className="text-sm py-2" />
          </FieldWrapper>
        </div>
        
        <div className="flex flex-col gap-3 md:gap-3">
          <FieldWrapper label="Client Name" required className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Location" required className="text-sm">
            <Input placeholder="Type here" className="text-sm py-2" />
          </FieldWrapper>
          
          <FieldWrapper label="Remarks" className="text-sm">
            <Textarea 
              placeholder="Type here" 
              className="min-h-[60px] md:min-h-[80px] text-sm"
            />
          </FieldWrapper>
        </div>
      </div>
      
      <div className="flex gap-3 pt-6">
        <button className="w-24 border border-gray-400 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button className="w-24 bg-customBlue text-white py-2 rounded text-sm font-medium hover:bg-customBlue/90 transition">
          Save
        </button>
      </div>
    </div>
  );
};

export default OfficeManagementForm;