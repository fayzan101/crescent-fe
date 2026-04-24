"use client";

import React, { useState } from "react";
import OverviewPage from './Overview/OverviewPage';
import ItemsPage from './Items/ItemsPage';
import SetupLayoutPage from './Setup/SetupLayoutPage';
import PurchaseOrderPage from './PurchaseOrder/PurchaseOrderPage';
import PurchaseRequestPage from './PurchaseRequest/PurchaseRequestPage';
import ReceiveGRNPage from './ReceiveGRN/ReceiveGRNPage';
import ReportsPage from './Reports/ReportsPage';

const InventoryManagementForm = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "items", label: "Items" },
    { key: "setup", label: "Setup" },
    { key: "purchase-order", label: "Purchase Order" },
    { key: "purchase-request", label: "Purchase Request" },
    { key: "receive-grn", label: "Receive GRN" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 min-h-[500px]">
      {/* Left tabs - vertical on desktop */}
      <div className="flex flex-col items-stretch gap-2 md:gap-3 md:w-48 shrink-0 white">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              w-full px-4 py-3 text-sm md:text-base 
              flex items-center justify-center rounded-lg transition-all duration-200
              whitespace-nowrap text-center min-h-[48px] md:min-h-[56px]
              ${activeTab === tab.key 
                ? "bg-customBlue text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right content area */}
      <div className="flex-1 min-w-0">
        {activeTab === "overview" && <OverviewPage />}
        {activeTab === "items" && <ItemsPage />}
        {activeTab === "setup" && <SetupLayoutPage />}
        {activeTab === "purchase-order" && <PurchaseOrderPage />}
        {activeTab === "purchase-request" && <PurchaseRequestPage />}
        {activeTab === "receive-grn" && <ReceiveGRNPage />}
        {activeTab === "reports" && <ReportsPage />}
      </div>
    </div>
  );
};

export default InventoryManagementForm;
