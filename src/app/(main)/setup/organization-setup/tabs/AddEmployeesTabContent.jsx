"use client";

import React, { useMemo, useState, useEffect, use } from "react";
import { useEmployees } from "@/hooks/employee/useEmployees";
import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";
import { useCreateRole } from "@/hooks/users/useCreateRole";
import FieldWrapper from "@/components/ui/FieldWrapper";
import Input from "@/components/ui/Input";
import FormActions from "@/components/components/FormActions";
import SearchList from "@/components/components/SearchList";
import EditModal from "@/components/components/EditModal";
import ViewModal from "@/components/components/ViewModal";
import ValidationErrorModal from "@/components/components/ValidationErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";
import Select from "@/components/ui/Select";
import { useRolesTypes } from "@/hooks/roles/useRolesTypes";

const EmployeeTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [emailId, setEmailId] = useState("");
  const [primaryMobileNo, setPrimaryMobileNo] = useState("");
  const [cnic, setCnic] = useState("");
  const [designation, setDesignation] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [nextOfKinContact, setNextOfKinContact] = useState("");
  const [editEmailId, setEditEmailId] = useState("");
  const [editPrimaryMobileNo, setEditPrimaryMobileNo] = useState("");
  const [editCnic, setEditCnic] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editNextOfKin, setEditNextOfKin] = useState("");
  const [editNextOfKinContact, setEditNextOfKinContact] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [localEmployees, setLocalEmployees] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [userRoleId, setUserRoleId] = useState("");

  const { data: UserRoles, isLoading: isLoadingRoles } = useRolesTypes();

  const { data, isLoading, error, isFetching, isPending, refetch } =
    useEmployees();

  const { mutate: deleteEmployee } = useDeleteEmployee({
    onSuccess: () => refetch(),
  });

  const {
    mutate: updateEmployee,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdateError,
  } = useUpdateEmployee({
    onSuccess: () => {
      resetForm();
      setShowEditModal(false);
      refetch();
    },
  });

  const { mutate: toggleStatus } = useUpdateEmployee();

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "Employee created successfully" });
      resetForm();
      refetch();
    },
  });

  const { mutate: createRole, isPending: isCreatingRole } = useCreateRole({
    onSuccess: () => {
      setSuccessModal({ isOpen: true, message: "User role assigned successfully" });
      resetUserRightsForm();
    },
  });

  // Sync localEmployees with data whenever data changes
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mapped = data.map((employee) => ({
        id: employee.employeeId,
        name: employee.emailId,
        email: employee.emailId,
        mobile: employee.primaryMobileNo,
        designation: employee.designation,
        isActive: employee.isActive,
      }));
      setLocalEmployees(mapped);
    }
  }, [data, isLoading, error]);

  const employees = useMemo(() => {
    if (isLoading || error) return [];
    return localEmployees;
  }, [localEmployees, isLoading, error]);

  const resetForm = () => {
    setEmailId("");
    setPrimaryMobileNo("");
    setCnic("");
    setDesignation("");
    setNextOfKin("");
    setNextOfKinContact("");
    setSelectedEmployee(null);
  };

  const resetEditForm = () => {
    setEditEmailId("");
    setEditPrimaryMobileNo("");
    setEditCnic("");
    setEditDesignation("");
    setEditNextOfKin("");
    setEditNextOfKinContact("");
  };

  const resetUserRightsForm = () => {
    setSelectedEmployeeId("");
    setUserRoleId("");
  };

  const validateCreateEmployee = () => {
    const errors = [];
    if (!emailId.trim()) errors.push("Email");
    if (!primaryMobileNo.trim()) errors.push("Primary Mobile No");
    if (!cnic.trim()) errors.push("CNIC");
    if (!designation.trim()) errors.push("Designations");
    if (!nextOfKin.trim()) errors.push("Next of Kin");
    if (!nextOfKinContact.trim()) errors.push("Next of Kin Contact");
    return errors;
  };

  const handleCreateEmployee = () => {
    const errors = validateCreateEmployee();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createEmployee({
      emailId,
      primaryMobileNo,
      cnic,
      designation,
      nextOfKin,
      nextOfKinContact,
      isActive: true,
    });
  };

  const validateUpdateEmployee = () => {
    const errors = [];
    if (!editEmailId.trim()) errors.push("Email");
    if (!editPrimaryMobileNo.trim()) errors.push("Primary Mobile No");
    if (!editCnic.trim()) errors.push("CNIC");
    if (!editDesignation.trim()) errors.push("Designations");
    if (!editNextOfKin.trim()) errors.push("Next of Kin");
    if (!editNextOfKinContact.trim()) errors.push("Next of Kin Contact");
    return errors;
  };

  const handleUpdateEmployee = (onSuccess) => {
    const errors = validateUpdateEmployee();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }
    if (!selectedEmployee) return;
    updateEmployee(
      {
        id: selectedEmployee.id,
        payload: {
          emailId: editEmailId,
          primaryMobileNo: editPrimaryMobileNo,
          cnic: editCnic,
          designation: editDesignation,
          nextOfKin: editNextOfKin,
          nextOfKinContact: editNextOfKinContact,
        },
      },
      { onSuccess }
    );
  };

  const handleToggleEmployee = (item) => {
    if (item?.id) {
      setLocalEmployees((prev) =>
        prev.map((employee) =>
          employee.id === item.id ? { ...employee, isActive: !employee.isActive } : employee
        )
      );
      toggleStatus({ id: item.id, payload: { isActive: !item.isActive } });
    }
  };

  const handleDeleteEmployee = (itemName, index) => {
    if (employees[index]?.id) {
      deleteEmployee(employees[index].id);
    }
  };

  const handleEditEmployee = (item) => {
    setSelectedEmployee(item);
    setEditEmailId(item.email || "");
    setEditPrimaryMobileNo(item.mobile || "");
    const employeeData = data?.find((e) => e.employeeId === item.id);
    setEditCnic(employeeData?.cnic || "");
    setEditDesignation(item.designation || "");
    setEditNextOfKin(employeeData?.nextOfKin || "");
    setEditNextOfKinContact(employeeData?.nextOfKinContact || "");
    setShowEditModal(true);
  };

  const handleAssignUserRights = () => {
    const errors = [];
    if (!selectedEmployeeId) errors.push("Employee");
    if (!userRoleId) errors.push("Role");
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return false;
    }
    createRole({
      userId: parseInt(selectedEmployeeId),
      roleId: parseInt(userRoleId),
      assignedByUserId: 1,
    });
  }

  const handleViewEmployee = (item) => {
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

  const userRoleOptions = useMemo(() => {
    if (isLoadingRoles || !UserRoles) return [];
    return UserRoles.map((role) => ({
      value: role.roleId,
      label: role.roleName,
    }));
  }, [UserRoles, isLoadingRoles]);

  useEffect(() => {
    console.log("User Role Options:", userRoleOptions);
  }, [userRoleOptions]);

  return (
    <div className="flex-1 flex flex-col">
      {/* SECTION 1: Add Employee */}
      <div className="pb-6 md:pb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
          Add Employee
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <FieldWrapper label="Email" required className="text-sm">
              <Input
                placeholder="Enter email"
                className="text-sm py-2"
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Primary Mobile No" required className="text-sm">
              <Input
                placeholder="Enter mobile number"
                className="text-sm py-2"
                value={primaryMobileNo}
                onChange={(e) => setPrimaryMobileNo(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="CNIC" required className="text-sm">
              <Input
                placeholder="e.g., 35202-1234567-1"
                className="text-sm py-2"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Designations" required className="text-sm">
                <Select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Select Designation"
                  options={[
                    { label: "GM", value: "GM" },
                    { label: "Manager", value: "Manager" },
                    { label: "Staff", value: "Staff" },
                    { label: "Technician", value: "Technician" }
                  ]}
                  className="text-sm"
                />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Next of Kin" required className="text-sm">
              <Input
                placeholder="Enter next of kin name"
                className="text-sm py-2"
                value={nextOfKin}
                onChange={(e) => setNextOfKin(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Next of Kin Contact" required className="text-sm">
              <Input
                placeholder="Enter contact number"
                className="text-sm py-2"
                value={nextOfKinContact}
                onChange={(e) => setNextOfKinContact(e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Employee ID" required className="text-sm">
              <Input
                value="Auto"
                readOnly
                className="text-sm py-2 bg-gray-50"
                placeholder="Auto"
              />
            </FieldWrapper>
          </div>
        </div>

        <FormActions
          onSave={handleCreateEmployee}
          onCancel={resetForm}
          tabName="Employee"
          isLoading={isCreating}
          showAutoSuccess={false}
        />

        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 mt-8">
          Assign User Rights
        </h2>
        
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-1">
            <FieldWrapper label="Employee" required className="text-sm">
              <Select
                name="selectedEmployeeId"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                placeholder="Select Employee"
                options={localEmployees.map((emp) => ({
                  value: emp.id.toString(),
                  label: emp.email,
                }))}
                className="text-sm"
              />
            </FieldWrapper>
          </div>

          <div className="space-y-1">
            <FieldWrapper label="Assign Role" required className="text-sm">
              <Select
                name="userRoleId"
                value={userRoleId}
                onChange={(e) => setUserRoleId(e.target.value)}
                placeholder="Select Role"
                options={userRoleOptions}
                className="text-sm"
              />
            </FieldWrapper>
          </div>
        </div>

          <FormActions
            onSave={handleAssignUserRights}
            onCancel={resetUserRightsForm}
            tabName="Employee"
            isLoading={isCreatingRole}
            showAutoSuccess={false}
          />
          
      </div>

      {/* SECTION 2: Search Item */}
      <div className="pb-6 md:pb-8">
        <SearchList
          isLoading={isLoading || isFetching || isPending}
          error={error?.message}
          items={employees}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewEmployee}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onToggle={handleToggleEmployee}
          tabName="Employee"
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        selectedItem={selectedEmployee}
        onUpdate={handleUpdateEmployee}
        onClose={handleCloseEditModal}
        isUpdating={isUpdating}
        error={updateError?.message}
        title="Edit Employee"
        itemType="employee"
        fields={[
          { label: "Email", value: editEmailId, onChange: setEditEmailId },
          { label: "Primary Mobile No", value: editPrimaryMobileNo, onChange: setEditPrimaryMobileNo },
          { label: "CNIC", value: editCnic, onChange: setEditCnic },
          { label: "Designation", value: editDesignation, onChange: setEditDesignation },
          { label: "Next of Kin", value: editNextOfKin, onChange: setEditNextOfKin },
          { label: "Next of Kin Contact", value: editNextOfKinContact, onChange: setEditNextOfKinContact },
        ]}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showViewModal}
        item={viewItem}
        onClose={handleCloseViewModal}
        title="Employee Details"
        fields={[
          { key: "id", label: "Employee ID" },
          { key: "email", label: "Email" },
          { key: "mobile", label: "Primary Mobile" },
          { key: "designation", label: "Designation" },
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
      />    </div>
  );
};

export default EmployeeTabContent;
