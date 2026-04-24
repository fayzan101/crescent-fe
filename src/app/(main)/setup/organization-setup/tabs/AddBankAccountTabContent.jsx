"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useBanks } from "@/hooks/bank/useBanks";
import { useBankAccounts } from "@/hooks/bank-account/useBankAccounts";
import { useCreateBankAccount } from "@/hooks/bank-account/useCreateBankAccount";
import { useUpdateBankAccount } from "@/hooks/bank-account/useUpdateBankAccount";
import { useDeleteBankAccount } from "@/hooks/bank-account/useDeleteBankAccount";
import SearchList from "@/components/components/SearchList";
import EditModal from "@/components/components/EditModal";
import ViewModal from "@/components/components/ViewModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormActions from "@/components/components/FormActions";

const AddBankAccountTabContent = () => {
  // Add form states (for creating new accounts)
  const [bankId, setBankId] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [iban, setIban] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branch, setBranch] = useState("");

  // Edit form states (for editing existing accounts)
  const [editBankId, setEditBankId] = useState("");
  const [editBankCode, setEditBankCode] = useState("");
  const [editBankName, setEditBankName] = useState("");
  const [editAccountNo, setEditAccountNo] = useState("");
  const [editIban, setEditIban] = useState("");
  const [editBranchCode, setEditBranchCode] = useState("");
  const [editBranch, setEditBranch] = useState("");

  // Local state for optimistic updates
  const [localAccounts, setLocalAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  // API hooks
  const { data: banksData } = useBanks();
  const { data, isLoading, error, isFetching, refetch } = useBankAccounts();

  // When bank is selected, populate bank name and code
  useEffect(() => {
    if (bankId && banksData) {
      const selectedBank = banksData.find((b) => b.bankId === parseInt(bankId));
      if (selectedBank) {
        setBankName(selectedBank.bankName);
        setBankCode(selectedBank.bankCode || "");
      }
    } else {
      setBankName("");
      setBankCode("");
    }
  }, [bankId, banksData]);

  // When edit bank is selected, populate edit bank name and code
  useEffect(() => {
    if (editBankId && banksData) {
      const selectedBank = banksData.find((b) => b.bankId === parseInt(editBankId));
      if (selectedBank) {
        setEditBankName(selectedBank.bankName);
        setEditBankCode(selectedBank.bankCode || "");
      }
    } else {
      setEditBankName("");
      setEditBankCode("");
    }
  }, [editBankId, banksData]);

  const { mutate: deleteAccount } = useDeleteBankAccount({
    onSuccess: () => refetch(),
  });

  const {
    mutate: updateAccount,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateBankAccount({
    onSuccess: () => {
      resetForm();
      setShowEditModal(false);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateBankAccount();

  const { mutate: createAccount, isPending: isCreating } = useCreateBankAccount({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Bank Account created successfully" });
      resetForm();
      setTimeout(() => refetch(), 1000);
    },
  });

  // Sync localAccounts with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((account) => {
        const bankName =
          banksData?.find((b) => b.bankId === account.bankId)?.bankName || "N/A";
        return {
          id: account.bankAccountId,
          name: `${bankName} - ${account.accountNo}`,
          bankId: account.bankId,
          bankName,
          accountNo: account.accountNo,
          iban: account.iban,
          branchCode: account.branchCode,
          branch: account.branch,
          isActive: account.isActive,
        };
      });
      setLocalAccounts(mapped);
    }
  }, [data, isLoading, error, banksData]);

  const accounts = useMemo(() => {
    if (isLoading || error) return [];
    return localAccounts;
  }, [localAccounts, isLoading, error]);

  const bankOptions = useMemo(
    () => {
      if (!banksData || banksData.length === 0) return [];
      return banksData.map((bank) => ({
        value: bank.bankId ? bank.bankId.toString() : "",
        label: bank.bankName || "Unknown Bank",
      }));
    },
    [banksData]
  );

  const resetForm = () => {
    setBankId("");
    setBankName("");
    setBankCode("");
    setAccountNo("");
    setIban("");
    setBranchCode("");
    setBranch("");
    setSelectedAccount(null);
  };

  const resetEditForm = () => {
    setEditBankId("");
    setEditBankName("");
    setEditBankCode("");
    setEditAccountNo("");
    setEditIban("");
    setEditBranchCode("");
    setEditBranch("");
  };

  const validateCreateAccount = () => {
    const errors = [];
    if (!bankId) errors.push("Bank Name");
    if (!accountNo.trim()) errors.push("Account No.");
    if (!iban.trim()) errors.push("IBAN");
    if (!branchCode.trim()) errors.push("Branch Code");
    if (!branch.trim()) errors.push("Branch");
    return errors;
  };

  const handleCreateAccount = () => {
    const errors = validateCreateAccount();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createAccount({
      bankId: parseInt(bankId),
      accountNo,
      iban,
      branchCode,
      branch,
      isActive: true,
    });
  };

  const validateUpdateAccount = () => {
    const errors = [];
    if (!editBankId) errors.push("Bank Name");
    if (!editAccountNo.trim()) errors.push("Account No.");
    if (!editIban.trim()) errors.push("IBAN");
    if (!editBranchCode.trim()) errors.push("Branch Code");
    if (!editBranch.trim()) errors.push("Branch");
    return errors;
  };

  const handleUpdateAccount = (onSuccess) => {
    const errors = validateUpdateAccount();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }
    if (!selectedAccount || !editBankId) return;
    updateAccount(
      {
        id: selectedAccount.id,
        payload: {
          bankId: parseInt(editBankId),
          accountNo: editAccountNo,
          iban: editIban,
          branchCode: editBranchCode,
          branch: editBranch,
        },
      },
      { onSuccess }
    );
  };

  const handleDeleteAccount = (itemName, index) => {
    if (accounts[index]?.id) {
      deleteAccount(accounts[index].id);
    }
  };

  const handleEditAccount = (item) => {
    setSelectedAccount(item);
    setEditBankId(item.bankId?.toString() || "");
    setEditBankName(item.bankName || "");
    setEditBankCode(banksData?.find((b) => b.bankId === item.bankId)?.bankCode || "");
    setEditAccountNo(item.accountNo);
    setEditIban(item.iban);
    setEditBranchCode(item.branchCode || "");
    setEditBranch(item.branch);
    setShowEditModal(true);
  };

  const handleToggleAccount = (item) => {
    if (item?.id) {
      setLocalAccounts((prev) =>
        prev.map((account) =>
          account.id === item.id
            ? { ...account, isActive: !account.isActive }
            : account
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleViewAccount = (item) => {
    setViewItem(item);
    setShowViewModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEditForm();
    resetUpdateError?.();
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewItem(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* SECTION 1: Add Bank Account */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Bank Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Bank Name" required className="text-sm">
              {banksData && banksData.length > 0 ? (
                <Select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  placeholder="Select Bank"
                  options={bankOptions}
                  className="text-sm"
                />
              ) : (
                <div className="text-sm text-gray-500 p-2 rounded">
                  Loading banks
                </div>
              )}
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Bank Code" required className="text-sm">
              <Input
                placeholder="Bank code"
                className="text-sm bg-gray-50"
                value={bankCode}
                readOnly
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Account No." required className="text-sm">
              <Input
                placeholder="Enter account number"
                className="text-sm"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="IBAN" required className="text-sm">
              <Input
                placeholder="Enter IBAN"
                className="text-sm"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Branch Code" required className="text-sm">
              <Input
                placeholder="Enter branch code"
                className="text-sm"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Branch" required className="text-sm">
              <Input
                placeholder="Enter branch name"
                className="text-sm"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </FieldWrapper>
          </div>
        </div>

        <FormActions
          onSave={handleCreateAccount}
          onCancel={resetForm}
          tabName="Bank Account"
          isLoading={isCreating}
          showAutoSuccess={false}
        />
      </div>

      {/* SECTION 2: Search List */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching}
          error={error?.message}
          items={accounts}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewAccount}
          onEdit={handleEditAccount}
          onDelete={handleDeleteAccount}
          onToggle={handleToggleAccount}
          tabName="Bank Account"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedAccount}
        onUpdate={handleUpdateAccount}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Bank Account"
        itemType="bank account"
        fields={[
          { label: "Bank Name", value: editBankId, onChange: setEditBankId, type: "select", options: bankOptions },
          { label: "Bank Code", value: editBankCode, onChange: setEditBankCode, readOnly: true },
          { label: "Account No.", value: editAccountNo, onChange: setEditAccountNo },
          { label: "IBAN", value: editIban, onChange: setEditIban },
          { label: "Branch Code", value: editBranchCode, onChange: setEditBranchCode },
          { label: "Branch", value: editBranch, onChange: setEditBranch },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Bank Account Details"
        fields={[
          { key: "id", label: "Account ID" },
          { key: "bankName", label: "Bank Name" },
          { key: "accountNo", label: "Account Number" },
          { key: "iban", label: "IBAN" },
          { key: "branch", label: "Branch" },
          {
            key: "isActive",
            label: "Status",
            render: (value) => (value ? "Active" : "Inactive"),
          },
        ]}
      />

      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        missingFields={validationErrors}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        title="Success"
        message={successModal.message}
      />
    </div>
  );
};

export default AddBankAccountTabContent;
