'use client';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Filter, Trash2, X, Minus, Loader, AlertCircle } from 'lucide-react';
import DataTable from '@/components/components/DataTable';
import { useGetAllGRNs } from '@/hooks/inventory/Grn/useGetAllGRNs';
import { useCreateGRN } from '@/hooks/inventory/Grn/useCreateGRN';
import { useDeleteGRN } from '@/hooks/inventory/Grn/useDeleteGRN';
import { useConfirmGRN } from '@/hooks/inventory/Grn/useConfirmGRN';
import { useUpdateGRN } from '@/hooks/inventory/Grn/useUpdateGRN';
import { usePurchaseOrders } from '@/hooks/inventory/purchase orders/usePurchaseOrders';
import { useDropdownItems } from '@/hooks/inventory/utility/useDropdownItems';
import { useDropdownStores } from '@/hooks/inventory/utility/useDropdownStores';
import { useDropdownVendors } from '@/hooks/inventory/utility/useDropdownVendors';
import { normalizeApiList } from '@/lib/normalizeApiList';

const ReceiveGRNPage = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [previewApproving, setPreviewApproving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPO, setSelectedPO] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [grnItems, setGrnItems] = useState([]);
  const [nextGrnNumber, setNextGrnNumber] = useState('GRN-2024-001');
  const [grnFormData, setGrnFormData] = useState({
    purchaseOrderId: '',
    storeId: '',
    vendorId: '',
    grnType: 'PURCHASE',
    itemId: '',
    quantityReceived: 1,
    conditionStatus: 'NEW'
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, grnNumber } for delete confirmation modal
  const [previewGrn, setPreviewGrn] = useState(null); // GRN being previewed
  const [editingGrnId, setEditingGrnId] = useState(null); // ID of GRN being edited

  const { data: grnsRaw, isLoading: loading } = useGetAllGRNs();
  const { data: purchaseOrdersRaw, isLoading: loadingPOs } = usePurchaseOrders();
  const { data: itemsRaw } = useDropdownItems();
  const { data: storesRaw } = useDropdownStores();
  const { data: vendorsRaw, isLoading: loadingVendors } = useDropdownVendors();
  const { mutateAsync: createGRN } = useCreateGRN();
  const { mutateAsync: updateGRN } = useUpdateGRN();
  const { mutateAsync: deleteGRN } = useDeleteGRN();
  const { mutateAsync: confirmGRN } = useConfirmGRN();

  const normalizeOrderLines = (order) => {
    if (!order || typeof order !== 'object') return [];
    if (Array.isArray(order.lines)) return order.lines;
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.purchaseOrderItems)) return order.purchaseOrderItems;
    return [];
  };

  const items = useMemo(
    () =>
      normalizeApiList(itemsRaw).map((item) => ({
        ...item,
        id: item.id ?? item.itemId ?? item._id,
        name: item.name || item.itemName || item.label || '',
        sku: item.sku || item.itemSku || '',
      })),
    [itemsRaw]
  );

  const itemLookup = useMemo(() => {
    const map = new Map();
    items.forEach((item) => map.set(String(item.id), item));
    return map;
  }, [items]);

  const purchaseOrders = useMemo(
    () =>
      normalizeApiList(purchaseOrdersRaw).map((order) => {
        const lines = normalizeOrderLines(order).map((line, idx) => {
          const rawItemId = line.itemId ?? line.id ?? line.inventoryItemId ?? '';
          const itemMeta = itemLookup.get(String(rawItemId));
          return {
            ...line,
            id: line.id ?? line.purchaseOrderLineId ?? `${order.purchaseOrderId ?? order.id ?? 'po'}-line-${idx}`,
            itemId: rawItemId,
            itemName: line.itemName || line.name || itemMeta?.name || `Item #${rawItemId}`,
            sku: line.itemSku || line.sku || itemMeta?.sku || '',
            quantityOrdered: Number(line.quantityOrdered ?? line.qty ?? line.quantity ?? 0),
            unitPrice: Number(line.unitPrice ?? line.price ?? 0),
          };
        });
        return {
          ...order,
          id: order.id ?? order.purchaseOrderId ?? order._id,
          poNo: order.purchaseOrderNo || order.poNo || order.code || '',
          prNo: order.purchaseRequestNo || order.purchasedRequestNo || order.prNo || '',
          officeId: order.officeId ?? order.office?.id ?? order.office?.officeId ?? '',
          officeName: order.officeName || order.office?.branchName || order.branchName || '',
          storeId: order.storeId ?? order.store?.id ?? order.store?.storeId ?? '',
          vendorId: order.vendorId ?? order.vendor?.id ?? order.vendor?.vendorId ?? '',
          lines,
        };
      }),
    [itemLookup, purchaseOrdersRaw]
  );

  const grns = useMemo(
    () =>
      normalizeApiList(grnsRaw).map((grn) => ({
        ...grn,
        id: grn.id ?? grn.grnId ?? grn._id,
        grnNo: grn.grnNo || grn.grnNumber || '',
        purchaseOrderId: grn.purchaseOrderId ?? grn.poId ?? grn.purchaseOrder?.purchaseOrderId ?? grn.po?.id ?? '',
        poNo: grn.poNo || grn.purchaseOrder?.poNo || grn.purchaseOrder?.purchaseOrderNo || '',
        prNo:
          grn.prNo ||
          grn.prNumber ||
          grn.purchaseOrder?.purchaseRequest?.requestNo ||
          grn.purchaseOrder?.purchaseRequestNo ||
          '',
        officeName: grn.officeName || grn.office?.branchName || grn.branchName || '',
        storeId: grn.storeId ?? grn.store?.storeId ?? grn.store?.id ?? '',
        storeName: grn.storeName || grn.store?.storeName || grn.store?.name || '',
        vendorId: grn.vendorId ?? grn.purchaseOrder?.vendorId ?? '',
        vendorName: grn.vendorName || grn.vendor?.vendorName || grn.vendor?.name || '',
        receivedByUserId: grn.receivedByUserId ?? grn.receivedByUser ?? grn.receivedBy ?? null,
        confirmedByUserId: grn.confirmedByUserId ?? null,
        confirmedAt: grn.confirmedAt ?? null,
        remarks: grn.remarks ?? null,
        receivedDate: grn.receivedDate || grn.createdAt || grn.updatedAt || null,
        items: Array.isArray(grn.lines) ? grn.lines : Array.isArray(grn.items) ? grn.items : [],
      })),
    [grnsRaw]
  );

  const vendors = useMemo(
    () =>
      normalizeApiList(vendorsRaw).map((vendor) => ({
        ...vendor,
        id: vendor.id ?? vendor.vendorId ?? vendor._id,
        name: vendor.name || vendor.vendorName || vendor.label || '',
      })),
    [vendorsRaw]
  );

  const stores = useMemo(
    () =>
      normalizeApiList(storesRaw).map((store) => ({
        id: store.id ?? store.storeId ?? store._id,
        name: store.name || store.storeName || store.label || 'N/A',
      })),
    [storesRaw]
  );

  const grnTableData = useMemo(
    () =>
      grns.map((grn) => ({
        ...grn,
        name: [
          grn.grnNo,
          grn.poNo,
          grn.prNo,
          grn.storeName,
          grn.grnType,
          grn.receivedByUserId,
        ]
          .filter(Boolean)
          .join(' '),
      })),
    [grns]
  );

  const grnColumns = useMemo(
    () => [
      { key: 'grnNo', label: 'GRN No.', width: '12%' },
      { key: 'poNo', label: 'PO No.', width: '12%' },
      { key: 'prNo', label: 'PR No.', width: '12%' },
      { key: 'storeName', label: 'Store', width: '18%' },
      { key: 'grnType', label: 'GRN Type', width: '12%' },
      {
        key: 'receivedDate',
        label: 'GRN Received On',
        width: '14%',
        render: (item) => (item.receivedDate ? new Date(item.receivedDate).toLocaleDateString() : 'N/A'),
      },
      { key: 'receivedByUserId', label: 'Received By', width: '12%' },
      {
        key: 'status',
        label: 'Status',
        width: '10%',
        render: (item) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
              item.status === 'RECEIVED'
                ? 'bg-green-100 text-green-700'
                : item.status === 'INSPECTING'
                ? 'bg-blue-100 text-blue-700'
                : item.status === 'REJECTED'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {item.status || 'PENDING'}
          </span>
        ),
      },
    ],
    []
  );
  const handlePreview = (grn) => {
    console.log('[ReceiveGRNPage.handlePreview] Previewing GRN:', grn);
    setPreviewGrn(grn);
  };

  const closePreviewModal = () => {
    setPreviewGrn(null);
  };

  const handleEdit = (grn) => {
    console.log('[ReceiveGRNPage.handleEdit] Editing GRN:', grn);
    
    // Only allow editing of PENDING GRNs
    if (grn.status !== 'PENDING') {
      toast.error('Only PENDING GRNs can be edited');
      return;
    }

    setEditingGrnId(grn.id);
    setGrnFormData({
      purchaseOrderId: grn.purchaseOrderId || '',
      storeId: grn.storeId || '',
      vendorId: grn.vendorId || '',
      grnType: grn.grnType || 'PURCHASE',
      itemId: '',
      quantityReceived: 1,
      conditionStatus: 'NEW'
    });
    setGrnItems(Array.isArray(grn.items) ? grn.items : []);
    setShowAddModal(true);
  };

  const handleDelete = async (grnId, grnNumber) => {
    // Open delete confirmation modal instead of window.confirm
    setDeleteConfirm({ id: grnId, grnNumber });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    const { id: grnId, grnNumber } = deleteConfirm;

    setDeleting(grnId);
    deleteGRN(grnId)
      .then(() => {
        toast.success(`Deleted ${grnNumber}`);
        queryClient.invalidateQueries(['grns']);
      })
      .catch(() => toast.error('Failed to delete GRN'))
      .finally(() => {
        setDeleteConfirm(null);
        setDeleting(null);
      });
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleApproveFromPreview = () => {
    if (!previewGrn?.id) return;
    setPreviewApproving(true);
    confirmGRN(previewGrn.id)
      .then(() => {
        toast.success('GRN approved successfully.');
        setPreviewGrn((prev) =>
          prev
            ? {
                ...prev,
                status: 'CONFIRMED',
                confirmedByUserId: prev.confirmedByUserId || prev.receivedByUserId || 'N/A',
                confirmedAt: new Date().toISOString(),
              }
            : prev
        );
        queryClient.invalidateQueries(['grns']);
      })
      .catch(() => toast.error('Failed to approve GRN.'))
      .finally(() => setPreviewApproving(false));
  };

  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === displayGrns.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(displayGrns.map(grn => grn.id));
      setSelectedRows(allIds);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate next GRN number based on existing GRNs
  const generateNextGrnNumber = () => {
    if (!grns || grns.length === 0) {
      return 'GRN-2024-001';
    }

    // Extract numeric part from existing GRN numbers
    const grnNumbers = grns
      .filter(grn => grn.grnNumber)
      .map(grn => {
        const match = grn.grnNumber.match(/GRN-\d+-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

    const maxNumber = Math.max(...grnNumbers, 0);
    const nextNumber = String(maxNumber + 1).padStart(3, '0');
    const year = new Date().getFullYear();
    return `GRN-${year}-${nextNumber}`;
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingGrnId(null);
    setGrnItems([]);
    setGrnFormData({
      purchaseOrderId: '',
      storeId: '',
      vendorId: '',
      grnType: 'PURCHASE',
      itemId: '',
      quantityReceived: 1,
      conditionStatus: 'NEW'
    });
  };

  const fetchPODetails = (poId) => {
    const po = purchaseOrders.find((order) => String(order.id ?? order.purchaseOrderId) === String(poId));
    setSelectedPO(po || null);
    if (po) {
      setGrnFormData((prev) => ({
        ...prev,
        poId: String(poId),
        storeId: po.storeId ? String(po.storeId) : prev.storeId,
        vendorId: po.vendorId ? String(po.vendorId) : prev.vendorId,
      }));
    }
  };

  const handleGrnFormChange = (e) => {
    const { name, value } = e.target;
    setGrnFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch PO details when PO is selected
    if (name === 'purchaseOrderId' && value) {
      fetchPODetails(value);
    }
  };

  const handleQuantityChange = (value) => {
    const num = parseInt(value) || 1;
    if (num > 0) {
      setGrnFormData(prev => ({
        ...prev,
        quantityReceived: num
      }));
    }
  };

  const handleAddItem = () => {
    // Validation order: field checks first, then business logic
    if (!grnFormData.purchaseOrderId) {
      toast.error('Please select a purchase order first');
      return;
    }

    if (!grnFormData.itemId) {
      toast.error('Please select an item');
      return;
    }

    if (!selectedPO) {
      toast.error('PO details are still loading. Please wait...');
      return;
    }

    if (!selectedPO.lines || selectedPO.lines.length === 0) {
      toast.error('Selected PO has no items');
      return;
    }

    const selectedItem = items.find(i => String(i.id) === String(grnFormData.itemId));
    if (!selectedItem) {
      toast.error('Item not found in system');
      return;
    }

    // Find the PO item to get quantityOrdered and unitPrice
    const poItem = selectedPO.lines.find(pi => String(pi.itemId) === String(grnFormData.itemId));
    if (!poItem) {
      console.error('[handleAddItem] PO item not found. Available items:', selectedPO.lines.map(i => i.itemId));
      toast.error('This item is not in the selected purchase order');
      return;
    }

    if (!poItem.quantityOrdered || poItem.quantityOrdered <= 0) {
      toast.error('PO item has no quantity ordered');
      return;
    }

    const newItem = {
      id: Date.now(),
      itemId: selectedItem.id ?? poItem.itemId,
      itemName: selectedItem.name || poItem.itemName || poItem.name || `Item #${poItem.itemId}`,
      sku: selectedItem.sku || poItem.sku || '',
      quantityReceived: grnFormData.quantityReceived,
      quantityOrdered: poItem.quantityOrdered,
      unitPrice: Number(poItem.unitPrice ?? 0),
      conditionStatus: grnFormData.conditionStatus,
      poItemId: poItem.id
    };

    setGrnItems((prev) => [...prev, newItem]);
    setGrnFormData(prev => ({
      ...prev,
      itemId: '',
      quantityReceived: 1,
      conditionStatus: 'NEW'
    }));
    toast.success('Item added to GRN');
  };

  const handleRemoveItem = (itemId) => {
    setGrnItems(grnItems.filter(item => item.id !== itemId));
    toast.success('Item removed from GRN');
  };

  const handleSubmitGRN = () => {
    if (!grnFormData.purchaseOrderId || grnItems.length === 0) {
      toast.error('Please select a purchase order and add at least one item.');
      return;
    }
    setSubmitting(true);
    const payload = {
      purchaseOrderId: Number(grnFormData.purchaseOrderId),
      lines: grnItems.map((item) => ({
        itemId: Number(item.itemId),
        qty: Math.max(1, Number.parseInt(item.quantityReceived, 10) || 1),
      })),
    };
    const submitPromise = editingGrnId
      ? updateGRN({ id: editingGrnId, data: payload })
      : createGRN(payload);

    submitPromise
      .then(() => {
        toast.success(editingGrnId ? 'GRN updated.' : 'GRN created.');
        handleCloseModal();
        queryClient.invalidateQueries(['grns']);
      })
      .catch((error) => {
        const msg = error?.response?.data?.message;
        const resolved = Array.isArray(msg) ? msg.join('; ') : msg;
        toast.error(resolved || 'Failed to save GRN.');
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <div className="bg-white p-6 min-h-screen scrollbar-hide">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receive GRN</h1>
            <p className="text-sm text-gray-500 mt-1">Manage received goods receipts using the shared table layout.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                  setNextGrnNumber(generateNextGrnNumber());
                  setShowAddModal(true);
                }}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90"
            >
              <Plus size={18} />
              Create New GRN
            </button>
          </div>
        </div>
{/* 
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">7-Step Atomic Transaction</p>
            <p className="text-xs text-blue-700 mt-1">Click "Receive" to start quality inspection. This will automatically: 1) Validate items, 2) Inspect quality, 3) Update PO, 4) Update inventory, 5) Record movements, 6) Update status, 7) Complete GRN.</p>
          </div>
        </div> */}

        <div className="space-y-4">
          <DataTable
            isLoading={loading}
            error={null}
            items={grnTableData}
            columns={grnColumns}
            showView={true}
            showEdit={true}
            showDelete={true}
            showToggle={false}
            searchQuery={searchTerm}
            onSearchChange={setSearchTerm}
            onView={handlePreview}
            onEdit={handleEdit}
            onDelete={handleDelete}
            tabName="GRN"
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>


      {/* Create/Edit GRN Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">{editingGrnId ? 'Edit GRN' : 'Create New GRN'}</h2>
              <button
                onClick={handleCloseModal}
                className="cursor-pointer text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
              {/* GRN Number Field - Auto-generated and Disabled */}
              <div>
                <label className="text-gray-700 font-semibold text-sm block mb-2">GRN Number</label>
                <input
                  type="text"
                  value={nextGrnNumber}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 text-sm cursor-not-allowed font-medium"
                  placeholder="Auto-generated"
                />
              </div>

              {/* GRN Details */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Purchase Order *</label>
                  <select
                    name="purchaseOrderId"
                    value={grnFormData.purchaseOrderId}
                    onChange={handleGrnFormChange}
                    disabled={loadingPOs || purchaseOrders.length === 0}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingPOs ? 'Loading POs...' : purchaseOrders.length === 0 ? 'No POs available' : 'Select PO'}
                    </option>
                    {purchaseOrders.map(po => (
                      <option key={po.id} value={po.id}>
                        {po.poNo ? `${po.poNo}` : `PO #${po.id}`}
                      </option>
                    ))}
                  </select>
                  {loadingPOs && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm">
                      <Loader size={16} className="animate-spin" />
                      <span>Loading purchase orders...</span>
                    </div>
                  )}
                  {!loadingPOs && purchaseOrders.length === 0 && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>No purchase orders found</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Store *</label>
                  <select
                    name="storeId"
                    value={grnFormData.storeId}
                    onChange={handleGrnFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Store</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Vendor *</label>
                  <select
                    name="vendorId"
                    value={grnFormData.vendorId}
                    onChange={handleGrnFormChange}
                    disabled={loadingVendors || vendors.length === 0}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingVendors ? 'Loading vendors...' : vendors.length === 0 ? 'No vendors available' : 'Select Vendor'}
                    </option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                    ))}
                  </select>
                  {loadingVendors && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600 text-sm">
                      <Loader size={16} className="animate-spin" />
                      <span>Loading vendors...</span>
                    </div>
                  )}
                  {!loadingVendors && vendors.length === 0 && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>No vendors found in your organization</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">GRN Type</label>
                  <select
                    name="grnType"
                    value={grnFormData.grnType}
                    onChange={handleGrnFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="PURCHASE">Purchase</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="RETURN">Return</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                  </select>
                </div>
              </div>

              {/* Item Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Item *</label>
                  <select
                    name="itemId"
                    value={grnFormData.itemId}
                    onChange={handleGrnFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select item</option>
                    {(selectedPO?.lines || []).map((line) => (
                      <option key={line.id} value={line.itemId}>
                        {line.itemName} ({line.sku || `#${line.itemId}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Condition Status</label>
                  <select
                    name="conditionStatus"
                    value={grnFormData.conditionStatus}
                    onChange={handleGrnFormChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="NEW">New</option>
                    <option value="GOOD">Good</option>
                    <option value="DAMAGED">Damaged</option>
                    <option value="DEFECTIVE">Defective</option>
                  </select>
                </div>
              </div>

              {/* Quantity and Add Button */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-gray-700 font-semibold text-sm block mb-2">Quantity Received *</label>
                  <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md p-2">
                    <button
                      onClick={() => handleQuantityChange(grnFormData.quantityReceived - 1)}
                      className="text-gray-600 hover:text-gray-800 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={grnFormData.quantityReceived}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="flex-1 bg-gray-100 text-center text-gray-700 focus:outline-none text-sm font-medium"
                    />
                    <button
                      onClick={() => handleQuantityChange(grnFormData.quantityReceived + 1)}
                      className="text-gray-600 hover:text-gray-800 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddItem}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md transition"
                >
                  Add Item
                </button>
              </div>

              {/* Review Details Section */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Review Items</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">S. No.</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Item SKU</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Item Name</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Qty Received</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Condition</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grnItems.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">No items added yet</td>
                        </tr>
                      ) : (
                        grnItems.map((item, index) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-gray-800 text-sm font-medium">{index + 1}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.sku}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.itemName}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm font-semibold">{item.quantityReceived}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm">{item.conditionStatus}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition inline-flex items-center justify-center"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGRN}
                disabled={submitting}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader size={16} className="animate-spin" />}
                {submitting ? (editingGrnId ? 'Updating...' : 'Creating...') : (editingGrnId ? 'Update GRN' : 'Create GRN')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete GRN <strong>{deleteConfirm.grnNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={cancelDelete} 
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={deleting === deleteConfirm.id}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleting === deleteConfirm.id ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRN Preview Modal */}
      {previewGrn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-linear-to-r from-blue-50 to-blue-25">
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">GRN Details</div>
              <button
                onClick={closePreviewModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">GRN Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600">GRN Number</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.grnNo || `GRN-${previewGrn.id || 'N/A'}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">PO No.</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.poNo || `PO-${previewGrn.purchaseOrderId || 'N/A'}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">PR No.</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.prNo || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Vendor</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.vendorName || previewGrn.vendor?.vendorName || previewGrn.vendor?.name || previewGrn.vendorId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Store</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.storeName || previewGrn.store?.storeName || previewGrn.store?.name || previewGrn.storeId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Status and Dates */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Status & Dates</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600">GRN Status</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.status || 'DRAFT'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                          previewGrn.status === 'RECEIVED'
                            ? 'bg-green-100 text-green-700'
                            : previewGrn.status === 'INSPECTING'
                            ? 'bg-blue-100 text-blue-700'
                            : previewGrn.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {previewGrn.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Received On</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {previewGrn.receivedDate ? new Date(previewGrn.receivedDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Received By</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.receivedByUserId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Confirmed By</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.confirmedByUserId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Confirmed At</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {previewGrn.confirmedAt ? new Date(previewGrn.confirmedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              {previewGrn.items && previewGrn.items.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">GRN Lines</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Item ID</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Qty Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewGrn.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.itemId || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.qtyReceived ?? item.quantityReceived ?? item.qty ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between gap-3">
              <button
                onClick={handleApproveFromPreview}
                disabled={previewApproving || previewGrn.status === 'CONFIRMED' || previewGrn.status === 'APPROVED'}
                className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {previewApproving && <Loader size={16} className="animate-spin" />}
                {previewApproving ? 'Approving...' : 'Approve GRN'}
              </button>
              <button
                onClick={closePreviewModal}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceiveGRNPage;
