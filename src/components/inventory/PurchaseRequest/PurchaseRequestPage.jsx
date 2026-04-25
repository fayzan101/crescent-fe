'use client';

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X, Loader } from 'lucide-react';
import DataTable from '@/components/components/DataTable';
import FieldWrapper from '@/components/ui/FieldWrapper';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ValidationErrorModal from '@/components/components/ValidationErrorModal';
import SuccessModal from '@/components/ui/SuccessModal';
import { useOffices } from '@/hooks/office/useOffices';
import { useDropdownItems } from '@/hooks/inventory/utility/useDropdownItems';
import { useDropdownStores } from '@/hooks/inventory/utility/useDropdownStores';
import { usePurchaseRequests } from '@/hooks/inventory/purchase request/usePurchaseRequests';
import { useCreatePurchaseRequest } from '@/hooks/inventory/purchase request/useCreatePurchaseRequest';
import { useUpdatePurchaseRequest } from '@/hooks/inventory/purchase request/useUpdatePurchaseRequest';
import { useDeletePurchaseRequest } from '@/hooks/inventory/purchase request/useDeletePurchaseRequest';

const PurchaseRequestPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [previewRequest, setPreviewRequest] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isEditingRequest, setIsEditingRequest] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [user] = useState({ id: 'admin@example.com', userId: 'admin' });

  const [purchaseRequestItems, setPurchaseRequestItems] = useState([]);
  const [purchaseFormData, setPurchaseFormData] = useState({
    officeId: '',
    storeId: '',
    itemSku: '',
    itemId: '',
    itemName: '',
    unitOfMeasurement: '',
    quantity: 1,
  });

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];

    const preferredKeys = ['data', 'items', 'results', 'list', 'rows', 'purchaseRequests', 'requests', 'content'];
    for (const key of preferredKeys) {
      if (Array.isArray(data[key])) return data[key];
    }

    for (const value of Object.values(data)) {
      if (Array.isArray(value)) return value;
      if (value && typeof value === 'object') {
        const nested = normalizeList(value);
        if (nested.length > 0) return nested;
      }
    }

    return [];
  };

  const normalizeItems = (data) => {
    return normalizeList(data).map((item) => ({
      ...item,
      id: item.id ?? item.itemId ?? item._id,
      name: item.name || item.itemName || '',
      sku: item.sku || item.itemSku || '',
      unitOfMeasurement: item.unitOfMeasurement || item.uom || '',
      price: item.price ?? item.unitPrice ?? 0,
    }));
  };

  const requestsQuery = usePurchaseRequests();
  const officesQuery = useOffices(undefined, { enabled: true });
  const storesQuery = useDropdownStores();
  const itemsQuery = useDropdownItems();

  const offices = useMemo(
    () => normalizeList(officesQuery.data).map((office) => ({
      ...office,
      id: office.id ?? office.officeId ?? office._id,
      branchName: office.branchName || office.officeName || office.name || '',
    })),
    [officesQuery.data]
  );

  const officeOptions = useMemo(
    () => offices.map((office) => ({ value: String(office.id), label: office.branchName })),
    [offices]
  );

  const stores = useMemo(
    () => normalizeList(storesQuery.data).map((store) => ({
      ...store,
      id: store.id ?? store.storeId ?? store._id ?? store.value,
      name: store.name || store.storeName || store.label || '',
      officeId: store.officeId ?? store.office?.id ?? store.branchId ?? store.office?.officeId ?? '',
    })),
    [storesQuery.data]
  );

  const storeOptions = useMemo(
    () => stores
      .filter((store) => !purchaseFormData.officeId || String(store.officeId) === String(purchaseFormData.officeId))
      .map((store) => ({ value: String(store.id), label: store.name })),
    [stores, purchaseFormData.officeId]
  );

  const items = useMemo(() => normalizeItems(itemsQuery.data), [itemsQuery.data]);

  const itemOptions = useMemo(
    () => items.map((item) => ({ value: String(item.id), label: item.sku ? `${item.sku} - ${item.name}` : item.name })),
    [items]
  );

  const requests = useMemo(() => {
    return normalizeList(requestsQuery.data).map((request) => ({
      ...request,
      id: request.id ?? request.requestId ?? request.purchaseRequestId ?? request._id,
      name: request.name || request.requestNo || request.purchaseRequestNo || request.id || '',
      officeId: request.officeId ?? request.office?.id ?? '',
      officeName: request.officeName || request.office?.branchName || request.branchName || '',
      storeId: request.storeId ?? request.store?.id ?? '',
      storeName: request.storeName || request.store?.name || '',
      userId: request.userId || request.createdBy || request.userEmail || '',
      createdAt: request.createdAt || request.createdOn || request.date || new Date().toISOString(),
      status: String(request.status || request.approvalStatus || 'DRAFT').toUpperCase(),
      isActive: request.isActive ?? true,
      items: Array.isArray(request.items) ? request.items : Array.isArray(request.purchaseRequestItems) ? request.purchaseRequestItems : [],
    }));
  }, [requestsQuery.data]);

  const tableColumns = [
    { key: 'officeName', label: 'Office', width: '15%' },
    { key: 'userId', label: 'User ID', width: '20%' },
    { key: 'id', label: 'Purchased Request', width: '15%' },
    {
      key: 'createdAt',
      label: 'Created On',
      width: '15%',
      render: (item) => new Date(item.createdAt).toLocaleDateString()
    },
    { key: 'section', label: 'Group / Section', width: '15%', render: () => 'General' },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (item) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
          item.status === 'APPROVED' || item.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' :
          item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {item.status || 'DRAFT'}
        </span>
      )
    }
  ];

  const resetForm = () => {
    setPurchaseRequestItems([]);
    setPurchaseFormData({
      officeId: '',
      storeId: '',
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1,
    });
    setIsEditingRequest(false);
    setSelectedRequestId(null);
    setSubmitError('');
  };

  const handleOpenModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value, 10) || 1;
    if (num > 0) {
      setPurchaseFormData((prev) => ({ ...prev, quantity: num }));
    }
  };

  const handleAddItem = () => {
    if (!purchaseFormData.itemId) {
      setValidationErrors(['Item']);
      setShowValidationError(true);
      return;
    }

    const selectedItem = items.find((item) => item.id === purchaseFormData.itemId);
    if (!selectedItem) return;

    setPurchaseRequestItems((prev) => [...prev, {
      id: Date.now(),
      itemId: selectedItem.id,
      itemSku: selectedItem.sku,
      itemName: selectedItem.name,
      unitOfMeasurement: purchaseFormData.unitOfMeasurement || selectedItem.unitOfMeasurement,
      quantity: purchaseFormData.quantity,
      unitPrice: selectedItem.price || 0,
    }]);

    setPurchaseFormData((prev) => ({
      ...prev,
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1,
    }));
  };

  const handleRemoveItem = (itemId) => {
    setPurchaseRequestItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const buildPayload = () => {
    const office = offices.find((item) => item.id === purchaseFormData.officeId);
    const store = stores.find((item) => item.id === purchaseFormData.storeId);
    const itemsToSubmit = [...purchaseRequestItems];

    if (purchaseFormData.itemId) {
      const selectedItem = items.find((item) => item.id === purchaseFormData.itemId);
      if (selectedItem) {
        itemsToSubmit.push({
          id: Date.now(),
          itemId: selectedItem.id,
          itemSku: selectedItem.sku,
          itemName: selectedItem.name,
          unitOfMeasurement: purchaseFormData.unitOfMeasurement || selectedItem.unitOfMeasurement,
          quantity: purchaseFormData.quantity,
          unitPrice: selectedItem.price || 0,
        });
      }
    }

    return {
      name: selectedRequestId || `PR${String(requests.length + 1).padStart(3, '0')}`,
      officeId: purchaseFormData.officeId,
      officeName: office?.branchName || '',
      storeId: purchaseFormData.storeId,
      storeName: store?.name || '',
      userId: user?.id || 'N/A',
      createdAt: new Date().toISOString(),
      status: 'DRAFT',
      isActive: true,
      items: itemsToSubmit,
      purchaseRequestItems: itemsToSubmit,
    };
  };

  const closeAfterSuccess = (message) => {
    setSuccessModal({ isOpen: true, message });
    setShowAddModal(false);
    resetForm();
  };

  const { mutate: createPurchaseRequest, isPending: isCreating } = useCreatePurchaseRequest({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      closeAfterSuccess('Purchase Request created successfully');
    },
    onError: (error) => {
      setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create purchase request.');
    },
  });

  const { mutate: updatePurchaseRequest, isPending: isUpdating } = useUpdatePurchaseRequest({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      closeAfterSuccess('Purchase Request updated successfully');
    },
    onError: (error) => {
      setSubmitError(error?.response?.data?.message || error?.message || 'Failed to update purchase request.');
    },
  });

  const { mutate: deletePurchaseRequest } = useDeletePurchaseRequest({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
    },
  });

  const filteredRequests = useMemo(() => {
    const term = searchQuery.toLowerCase();
    return requests.filter((request) =>
      (request.officeName || '').toLowerCase().includes(term) ||
      (request.userId || '').toLowerCase().includes(term) ||
      (request.id || '').toLowerCase().includes(term) ||
      (request.name || '').toLowerCase().includes(term)
    );
  }, [requests, searchQuery]);

  const handleAddRequest = () => {
    if (!purchaseFormData.officeId || !purchaseFormData.storeId || (purchaseRequestItems.length === 0 && !purchaseFormData.itemId)) {
      setValidationErrors(['Office', 'Store', 'Items']);
      setShowValidationError(true);
      return;
    }

    const payload = buildPayload();
    setSubmitError('');

    if (isEditingRequest && selectedRequestId) {
      updatePurchaseRequest({ id: selectedRequestId, data: payload });
      return;
    }

    createPurchaseRequest(payload);
  };

  const handleDeleteRequest = (itemId) => {
    if (!itemId) return;
    deletePurchaseRequest(itemId);
  };

  const handleEditRequest = (item) => {
    setSelectedRequestId(item.id);
    setIsEditingRequest(true);
    setPurchaseRequestItems(Array.isArray(item.items) ? item.items : []);
    setPurchaseFormData({
      officeId: item.officeId || '',
      storeId: item.storeId || '',
      itemSku: '',
      itemId: '',
      itemName: '',
      unitOfMeasurement: '',
      quantity: 1,
    });
    setShowAddModal(true);
  };

  const handleViewRequest = (item) => {
    setPreviewRequest(item);
  };

  const previewItems = previewRequest?.items || previewRequest?.purchaseRequestItems || [];

  return (
    <div className="bg-white p-8 min-h-screen scrollbar-hide m-5 rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Requests</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90"
        >
          <Plus size={18} />
          Add New Request
        </button>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="pb-6 md:pb-8">
        <DataTable
          isLoading={requestsQuery.isLoading || officesQuery.isLoading || storesQuery.isLoading || itemsQuery.isLoading}
          error={requestsQuery.error?.message || officesQuery.error?.message || storesQuery.error?.message || itemsQuery.error?.message || null}
          items={filteredRequests}
          columns={tableColumns}
          showView={true}
          showEdit={true}
          showDelete={true}
          showToggle={false}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onView={handleViewRequest}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
          tabName="Purchase Request"
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditingRequest ? 'Edit Purchase Request' : 'Add New Purchase Request'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FieldWrapper label="Office" required className="text-sm">
                  <Select
                    placeholder="Select Office"
                    value={purchaseFormData.officeId}
                    onChange={(e) => setPurchaseFormData((prev) => ({ ...prev, officeId: e.target.value }))}
                    className="text-sm"
                    options={officeOptions}
                  >
                  </Select>
                </FieldWrapper>

                <FieldWrapper label="Store" required className="text-sm">
                  <Select
                    placeholder="Select Store"
                    value={purchaseFormData.storeId}
                    onChange={(e) => setPurchaseFormData((prev) => ({ ...prev, storeId: e.target.value }))}
                    className="text-sm"
                    options={storeOptions}
                  >
                  </Select>
                </FieldWrapper>

                <FieldWrapper label="User ID" required className="text-sm">
                  <Input value={user?.id || 'Loading...'} disabled className="text-sm py-2 bg-gray-50" />
                </FieldWrapper>

                <FieldWrapper label="Date & Time" required className="text-sm">
                  <Input value={new Date().toLocaleString()} disabled className="text-sm py-2 bg-gray-50" />
                </FieldWrapper>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldWrapper label="Item SKU / Name" required className="text-sm">
                    <Select
                      placeholder="Select Item"
                      value={purchaseFormData.itemId}
                      onChange={(e) => {
                        const selected = items.find((item) => item.id === e.target.value);
                        if (selected) {
                          setPurchaseFormData((prev) => ({
                            ...prev,
                            itemId: selected.id,
                            itemSku: selected.sku,
                            itemName: selected.name,
                            unitOfMeasurement: selected.unitOfMeasurement,
                          }));
                        }
                      }}
                      className="text-sm"
                      options={itemOptions}
                    >
                    </Select>
                  </FieldWrapper>

                  <FieldWrapper label="Unit of Measurement" required className="text-sm">
                    <Input value={purchaseFormData.unitOfMeasurement} disabled className="text-sm py-2 bg-gray-50" />
                  </FieldWrapper>
                </div>

                <FieldWrapper label="Quantity" required className="text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantityChange(purchaseFormData.quantity - 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold cursor-pointer">−</button>
                    <Input
                      type="number"
                      value={purchaseFormData.quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="text-sm py-2 text-center flex-1"
                    />
                    <button onClick={() => handleQuantityChange(purchaseFormData.quantity + 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold cursor-pointer">+</button>
                  </div>
                </FieldWrapper>

              </div>

              {purchaseRequestItems.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Review Details</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">S. No.</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Item SKU</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Item Name</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Unit</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Quantity</th>
                          <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseRequestItems.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">{String(index + 1).padStart(2, '0')}</td>
                            <td className="px-4 py-3 text-gray-700">{item.itemSku}</td>
                            <td className="px-4 py-3 text-gray-700">{item.itemName}</td>
                            <td className="px-4 py-3 text-gray-700">{item.unitOfMeasurement}</td>
                            <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="w-6 h-6 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center text-white mx-auto"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
              <button
                onClick={handleCloseModal}
                className="w-40 py-3.5 border border-customBlue text-customBlue hover:bg-gray-50 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRequest}
                disabled={isCreating || isUpdating}
                className="w-40 py-3.5 bg-customBlue text-white hover:bg-customBlue/90 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(isCreating || isUpdating) && <Loader size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {previewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Request Details</h2>
              <button onClick={() => setPreviewRequest(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['Office', previewRequest.officeName || 'N/A'],
                  ['Store', previewRequest.storeName || 'N/A'],
                  ['User', previewRequest.userId || 'N/A'],
                  ['Request No.', previewRequest.id || 'N/A'],
                  ['Created On', new Date(previewRequest.createdAt).toLocaleString()],
                  ['Status', previewRequest.status || 'DRAFT'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-sm text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {previewItems.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Items</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Item SKU</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Item Name</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Unit</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">{item.itemSku || item.sku || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-700">{item.itemName || item.name || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-700">{item.unitOfMeasurement || 'N/A'}</td>
                            <td className="px-4 py-3 text-gray-700">{item.quantity || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-white shrink-0">
              <button
                onClick={() => setPreviewRequest(null)}
                className="w-40 py-3.5 bg-customBlue text-white hover:bg-customBlue/90 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ValidationErrorModal
        isOpen={showValidationError}
        onClose={() => setShowValidationError(false)}
        missingFields={validationErrors}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
        title="Success"
        message={successModal.message}
      />
    </div>
  );
};

export default PurchaseRequestPage;
