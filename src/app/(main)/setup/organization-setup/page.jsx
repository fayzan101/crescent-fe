"use client";

import React, { useState, useEffect } from "react";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import AddOfficeTabContent from "./tabs/AddOfficeTabContent";
import AddProductsTabContent from "./tabs/AddProductsTabContent";
import AddBankAccountTabContent from "./tabs/AddBankAccountTabContent";
import AddVendorsTabContent from "./tabs/AddVendorsTabContent";
import AddEmployeesTabContent from "./tabs/AddEmployeesTabContent";
import AddClientsCategoryTabContent from "./tabs/AddClientsCategoryTabContent";
import AddPackageTypeTabContent from "./tabs/AddPackageTypeTabContent";
import CreateZoneTabContent from "./tabs/CreateZoneTabContent";

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("organizationSetupActiveTab") || "addOffice";
    }
    return "addOffice";
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("organizationSetupActiveTab", activeTab);
  }, [activeTab]);

  const tabs = [
    { key: "addOffice", label: "Add Office" },
    { key: "addProducts", label: "Add Products" },
    { key: "addBankAccount", label: "Add Bank Account" },
    { key: "addVendors", label: "Add Vendors & Suppliers" },
    { key: "addEmployees", label: "Add Employees" },
    { key: "addClientsCategory", label: "Add Clients Category" },
    { key: "addPackageType", label: "Add Package Type" },
    { key: "createZone", label: "Create Zone & Technician" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 min-h-200 font-inter">
      {/* Left tabs - vertical on desktop */}
      <div className="flex flex-col items-stretch gap-2 md:gap-3 md:max-w-40 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              w-full px-4 py-3 text-sm md:text-base 
              flex items-center justify-center rounded-lg transition-all duration-200
              whitespace-normal text-center min-h-12 md:min-h-14
              ${activeTab === tab.key 
                ? "bg-customGreen text-white shadow-md" 
                : "bg-gray-300 text-gray-700 hover:bg-gray-200 cursor-pointer"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0">
        {activeTab === "addOffice" && <AddOfficeTabContent />}
        {activeTab === "addProducts" && <AddProductsTabContent />}
        {activeTab === "addBankAccount" && <AddBankAccountTabContent />}
        {activeTab === "addVendors" && <AddVendorsTabContent />}
        {activeTab === "addEmployees" && <AddEmployeesTabContent />}
        {activeTab === "addClientsCategory" && <AddClientsCategoryTabContent />}
        {activeTab === "addPackageType" && <AddPackageTypeTabContent />}
        {activeTab === "createZone" && <CreateZoneTabContent />}
      </div>
    </div>
  );
}
