"use client";

import { createContext, useContext, useState } from "react";

/**
 * Create Context
 */
const SalesContext = createContext(null);

/**
 * Provider
 */
export const SalesProvider = ({ children }) => {
  const [activeForm, setActiveForm] = useState("addSale");

  // helpers (clear & readable)
  const showAddSaleForm = () => setActiveForm("addSale");
  const showAccountsApprovalForm = () => setActiveForm("accountsApproval");
  const showOperationsProcessForm = () => setActiveForm("operationsProcess");
  const showInstallationForm = () => setActiveForm("installation");

  return (
    <SalesContext.Provider
      value={{
        // state
        activeForm,

        // booleans (easy conditional rendering)
        // isAddSaleForm: activeForm === "addSale",
        // isAccountsApprovalForm: activeForm === "accountsApproval",
        // isOperationsProcessForm: activeForm === "operationsProcess",
        // isInstallationForm: activeForm === "installation",

        // actions
        showAddSaleForm,
        showAccountsApprovalForm,
        showOperationsProcessForm,
        showInstallationForm,
        setActiveForm, // optional direct access
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

/**
 * Custom Hook (Professional way)
 */
export const useSales = () => {
  const context = useContext(SalesContext);

  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }

  return context;
};
