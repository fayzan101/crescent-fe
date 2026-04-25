'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, X, Minus, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const ReceiveGRNPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [receiving, setReceiving] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingPOs, setLoadingPOs] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [grnItems, setGrnItems] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [nextGrnNumber, setNextGrnNumber] = useState('GRN-2024-001');
  const [grnFormData, setGrnFormData] = useState({
    poId: '',
    storeId: '',
    vendorId: '',
    grnType: 'PURCHASE',
    itemId: '',
    quantityReceived: 1,
    conditionStatus: 'NEW'
  });
  const [inspectionData, setInspectionData] = useState({
    quantityAccepted: 0,
    quantityRejected: 0,
    conditionStatus: 'GOOD'
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, grnNumber } for delete confirmation modal
  const [previewGrn, setPreviewGrn] = useState(null); // GRN being previewed
  const [editingGrnId, setEditingGrnId] = useState(null); // ID of GRN being edited

  useEffect(() => {
    fetchGrns();
    fetchPurchaseOrders();
    fetchItems();
    fetchStores();
    fetchVendors();
  }, []);

  const fetchGrns = () => {
    setLoading(true);
    setGrns([]);
    setTotalItems(0);
    setTotalPages(0);
    setLoading(false);
  };

  const fetchPurchaseOrders = () => {
    setLoadingPOs(true);
    setPurchaseOrders([]);
    setLoadingPOs(false);
  };

  const fetchItems = () => {
    setItems([]);
  };

  const fetchStores = () => {
    setStores([]);
  };

  const fetchVendors = () => {
    setLoadingVendors(true);
    setVendors([]);
    setLoadingVendors(false);
  };

  const filteredGrns = (Array.isArray(grns) ? grns : []).filter(grn =>
    grn.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.poId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayGrns = filteredGrns;

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
      poId: grn.poId || '',
      storeId: grn.storeId || '',
      vendorId: grn.vendorId || '',
      grnType: grn.grnType || 'PURCHASE',
      itemId: '',
      quantityReceived: 1,
      conditionStatus: 'NEW'
    });
    setGrnItems(grn.items || []);
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
    toast.error(`Delete is unavailable until APIs are implemented (${grnNumber}).`);
    setDeleteConfirm(null);
    setDeleting(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleReceiveGrn = (grnId) => {
    setReceiving(grnId);
    toast.error('Receive workflow is unavailable until APIs are implemented.');
    setReceiving(null);
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
      poId: '',
      storeId: '',
      vendorId: '',
      grnType: 'PURCHASE',
      itemId: '',
      quantityReceived: 1,
      conditionStatus: 'NEW'
    });
  };

  const fetchPODetails = () => {
    setSelectedPO(null);
  };

  const handleGrnFormChange = (e) => {
    const { name, value } = e.target;
    setGrnFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch PO details when PO is selected
    if (name === 'poId' && value) {
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
    if (!grnFormData.poId) {
      toast.error('Please select a purchase order first');
      return;
    }

    if (!grnFormData.itemId) {
      toast.error('Please select an item');
      return;
    }

    if (!grnFormData.storeId) {
      toast.error('Please select a store');
      return;
    }

    if (!selectedPO) {
      toast.error('PO details are still loading. Please wait...');
      return;
    }

    if (!selectedPO.items || selectedPO.items.length === 0) {
      toast.error('Selected PO has no items');
      return;
    }

    const selectedItem = items.find(i => i.id === grnFormData.itemId);
    if (!selectedItem) {
      toast.error('Item not found in system');
      return;
    }

    // Find the PO item to get quantityOrdered and unitPrice
    const poItem = selectedPO.items.find(pi => pi.itemId === grnFormData.itemId);
    if (!poItem) {
      console.error('[handleAddItem] PO item not found. Available items:', selectedPO.items.map(i => i.itemId));
      toast.error('This item is not in the selected purchase order');
      return;
    }

    if (!poItem.quantityOrdered || poItem.quantityOrdered === 0) {
      toast.error('PO item has no quantity ordered');
      return;
    }

    if (!poItem.unitPrice) {
      toast.error('PO item has no unit price');
      return;
    }

    const newItem = {
      id: Date.now(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      sku: selectedItem.sku,
      quantityReceived: grnFormData.quantityReceived,
      quantityOrdered: poItem.quantityOrdered,
      unitPrice: poItem.unitPrice,
      conditionStatus: grnFormData.conditionStatus,
      poItemId: poItem.id
    };

    setGrnItems([...grnItems, newItem]);
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
    setSubmitting(true);
    toast.error('Submission is unavailable until APIs are implemented.');
    setSubmitting(false);
  };

  return (
    <>
      <div className="bg-white p-6 min-h-screen scrollbar-hide">
        {/* Header with Search, Add Button, Filter */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg w-64 px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Here"
              className="bg-transparent ml-3 w-full outline-none text-gray-600 placeholder-gray-400 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setNextGrnNumber(generateNextGrnNumber());
                setShowAddModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition text-sm">
              <Plus size={18} />
              Create New GRN
            </button>
            <button className="border border-gray-300 p-2 rounded-lg hover:bg-gray-100 transition">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Alert Box - 7-Step Transaction Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">7-Step Atomic Transaction</p>
            <p className="text-xs text-blue-700 mt-1">Click "Receive" to start quality inspection. This will automatically: 1) Validate items, 2) Inspect quality, 3) Update PO, 4) Update inventory, 5) Record movements, 6) Update status, 7) Complete GRN.</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === displayGrns.length && displayGrns.length > 0}
                    onChange={toggleAllSelection}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Office</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Purchase Request No.</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Purchase Order No.</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">GRN No.</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">GRN Type</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">GRN Received On</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Received By</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Status</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-sm text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader className="animate-spin" size={20} />
                      Loading GRNs...
                    </div>
                  </td>
                </tr>
              ) : displayGrns.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-500">No GRNs found</td>
                </tr>
              ) : (
                displayGrns.map((grn) => (
                  <tr key={grn.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(grn.id)}
                        onChange={() => toggleRowSelection(grn.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{grn.store?.name || grn.storeName || grn.storeId || 'N/A'}</td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{grn.prNumber || 'N/A'}</td>
                    <td className="py-4 px-4 text-gray-700 text-sm font-medium">{grn.poId}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900 text-sm">{grn.grnNumber}</td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{grn.grnType || 'PURCHASE'}</td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{new Date(grn.receivedDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-gray-700 text-sm">{grn.receivedByUser || grn.receivedBy || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        grn.status === 'RECEIVED'
                          ? 'bg-green-100 text-green-700'
                          : grn.status === 'INSPECTING'
                          ? 'bg-blue-100 text-blue-700'
                          : grn.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {grn.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handlePreview(grn)}
                          className="w-8 h-8 rounded-md bg-yellow-400 flex items-center justify-center hover:bg-yellow-500 transition"
                          title="Preview"
                        >
                          <Eye size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleEdit(grn)}
                          disabled={grn.status !== 'PENDING'}
                          className="w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          title="Edit (Only for PENDING)"
                        >
                          <Edit2 size={16} className="text-white" />
                        </button>
                        {/* Confirm to Receive button - only for PENDING status */}
                        {grn.status === 'PENDING' && (
                          <button
                            onClick={() => handleReceiveGrn(grn.id, grn.items)}
                            disabled={receiving === grn.id}
                            className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center hover:bg-green-600 disabled:opacity-50 transition"
                            title="Confirm to receive stock"
                          >
                            {receiving === grn.id ? <Loader size={16} className="text-white animate-spin" /> : <CheckCircle size={16} className="text-white" />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(grn.id, grn.grnNumber)}
                          disabled={deleting === grn.id}
                          className="w-8 h-8 rounded-md bg-red-500 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 transition"
                          title="Delete"
                        >
                          {deleting === grn.id ? <Loader size={16} className="text-white animate-spin" /> : <Trash2 size={16} className="text-white" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm font-medium">Showing:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-center flex-1">
            <span className="text-gray-600 text-sm">
              Showing {displayGrns.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalItems)} out of {totalItems} records
            </span>
          </div>

          <div className="flex gap-1 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 2))
              .map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded transition text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit GRN Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">{editingGrnId ? 'Edit GRN' : 'Create New GRN'}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
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
                    name="poId"
                    value={grnFormData.poId}
                    onChange={handleGrnFormChange}
                    disabled={loadingPOs || purchaseOrders.length === 0}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingPOs ? 'Loading POs...' : purchaseOrders.length === 0 ? 'No POs available' : 'Select PO'}
                    </option>
                    {purchaseOrders.map(po => (
                      <option key={po.id} value={po.id}>PO #{po.id}</option>
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
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-25">
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
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.grnNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Purchase Order</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.poId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Vendor</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.vendor?.name || previewGrn.vendorId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Office/Store</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.store?.name || previewGrn.storeId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Status and Dates */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Status & Dates</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-600">GRN Type</p>
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.grnType || 'PURCHASE'}</p>
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
                      <p className="text-sm font-semibold text-gray-900">{previewGrn.receivedByUser || previewGrn.receivedBy || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              {previewGrn.items && previewGrn.items.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Items Received</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Item ID</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Quantity Ordered</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Quantity Received</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Unit Price</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewGrn.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.itemId || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantityOrdered || 0}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantityReceived || 0}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">${(parseFloat(item.unitPrice) || 0).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.conditionStatus === 'GOOD'
                                  ? 'bg-green-100 text-green-700'
                                  : item.conditionStatus === 'DAMAGED'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {item.conditionStatus || 'NEW'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
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
