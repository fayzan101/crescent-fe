"use client";

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X, Loader } from 'lucide-react';
import DataTable from '../../components/DataTable';
import FieldWrapper from '../../ui/FieldWrapper';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { useOffices } from '@/hooks/office/useOffices';
import { useDropdownItems } from '@/hooks/inventory/utility/useDropdownItems';
import { usePurchaseOrders } from '@/hooks/inventory/purchase orders/usePurchaseOrders';
import { useCreatePurchaseOrder } from '@/hooks/inventory/purchase orders/useCreatePurchaseOrder';
import { useDeletePurchaseOrder } from '@/hooks/inventory/purchase orders/useDeletePurchaseOrder';

const PurchaseOrderPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [previewPO, setPreviewPO] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, poId: null });
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        officeId: '',
        office: '',
        user: '1 - Admin User',
        date: '',
        expectedDeliveryDate: '',
        taxAmount: '',
        shippingCost: '',
        discountAmount: '',
        notes: '',
        poItems: [],
        currentItem: {
            itemId: '',
            itemName: '',
            unitOfMeasurement: '',
            quantityOrdered: 1,
            unitPrice: '',
            totalPrice: ''
        }
    });

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (!data || typeof data !== 'object') return [];

        const preferredKeys = ['data', 'items', 'results', 'list', 'rows', 'purchaseOrders', 'orders', 'content'];
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

    const purchaseOrdersQuery = usePurchaseOrders();
    const officesQuery = useOffices(undefined, { enabled: true });
    const itemsQuery = useDropdownItems();

    const offices = useMemo(() => {
        return normalizeList(officesQuery.data).map((office) => ({
            ...office,
            id: office.id ?? office.officeId ?? office._id,
            branchName: office.branchName || office.officeName || office.name || '',
        }));
    }, [officesQuery.data]);

    const officeOptions = useMemo(
        () => offices.map((office) => ({ value: String(office.id), label: office.branchName })),
        [offices]
    );

    const normalizedItems = useMemo(() => {
        return normalizeList(itemsQuery.data).map((item) => ({
            ...item,
            id: item.id ?? item.itemId ?? item._id ?? item.value,
            name: item.name || item.itemName || item.label || '',
            unitOfMeasurement: item.unitOfMeasurement || item.uom || item.unit || '',
            price: item.price ?? item.unitPrice ?? item.rate ?? 0,
        }));
    }, [itemsQuery.data]);

    const itemOptions = useMemo(
        () => normalizedItems.map((item) => ({ value: String(item.id), label: item.sku ? `${item.sku} - ${item.name}` : item.name })),
        [normalizedItems]
    );

    const normalizedOrders = useMemo(() => {
        return normalizeList(purchaseOrdersQuery.data).map((order) => ({
            ...order,
            id: order.id ?? order.purchaseOrderId ?? order._id,
            store: order.store || order.officeName || order.branchName || '',
            userId: order.userId || order.createdBy || order.userEmail || '',
            purchasedRequestNo: order.purchasedRequestNo || order.purchaseRequestNo || order.prNo || '',
            purchaseOrderNo: order.purchaseOrderNo || order.poNo || order.code || '',
            createdOn: order.createdOn || order.createdAt || order.date || '',
            approvalStatus: String(order.approvalStatus || order.status || 'DRAFT').toUpperCase(),
            deliveryStatus: String(order.deliveryStatus || order.delivery_state || 'PENDING').toUpperCase(),
        }));
    }, [purchaseOrdersQuery.data]);

    const resetForm = () => ({
        officeId: '',
        office: '',
        user: '1 - Admin User',
        date: '',
        expectedDeliveryDate: '',
        taxAmount: '',
        shippingCost: '',
        discountAmount: '',
        notes: '',
        poItems: [],
        currentItem: {
            itemId: '',
            itemName: '',
            unitOfMeasurement: '',
            quantityOrdered: 1,
            unitPrice: '',
            totalPrice: ''
        }
    });

    const getPurchaseOrderId = (order) => {
        if (!order) return null;
        if (typeof order === 'string' || typeof order === 'number') return order;
        return order.id ?? order.purchaseOrderId ?? order._id ?? null;
    };

    const { mutate: createPurchaseOrder, isPending: isCreating } = useCreatePurchaseOrder({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            setShowAddModal(false);
            setSubmitError('');
            setFormData(resetForm());
        },
        onError: (error) => {
            setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create purchase order.');
        },
    });

    const { mutate: deletePurchaseOrder, isPending: isDeleting } = useDeletePurchaseOrder({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
            setDeleteModal({ isOpen: false, poId: null });
        },
    });

    const filteredOrders = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return normalizedOrders.filter((order) =>
            (order.store || '').toLowerCase().includes(term) ||
            (order.userId || '').toLowerCase().includes(term) ||
            (order.purchasedRequestNo || '').toLowerCase().includes(term) ||
            (order.purchaseOrderNo || '').toLowerCase().includes(term)
        );
    }, [normalizedOrders, searchTerm]);

    const tableColumns = [
        { key: 'store', label: 'Store', width: '15%' },
        { key: 'userId', label: 'User', width: '15%' },
        { key: 'purchasedRequestNo', label: 'PR #', width: '12%' },
        { key: 'purchaseOrderNo', label: 'PO #', width: '12%' },
        { key: 'createdOn', label: 'Created On', width: '15%' },
        {
            key: 'approvalStatus',
            label: 'Approval Status',
            width: '12%',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    item.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    item.approvalStatus === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                    {item.approvalStatus}
                </span>
            )
        },
        {
            key: 'deliveryStatus',
            label: 'Delivery Status',
            width: '12%',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.deliveryStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    item.deliveryStatus === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {item.deliveryStatus}
                </span>
            )
        }
    ];

    const handleOpenModal = () => {
        setSubmitError('');
        setFormData(resetForm());
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSubmitError('');
        setFormData(resetForm());
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value, 10) || 1);
        const unitPrice = formData.currentItem.unitPrice;
        setFormData((prev) => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                quantityOrdered: value,
                totalPrice: unitPrice ? (value * parseFloat(unitPrice)).toFixed(2) : ''
            }
        }));
    };

    const handleUnitPriceChange = (e) => {
        const unitPrice = e.target.value;
        const qty = formData.currentItem.quantityOrdered;
        setFormData((prev) => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                unitPrice,
                totalPrice: unitPrice && qty ? (parseFloat(unitPrice) * qty).toFixed(2) : ''
            }
        }));
    };

    const handleIncrement = () => {
        const newQty = formData.currentItem.quantityOrdered + 1;
        const unitPrice = formData.currentItem.unitPrice;
        setFormData((prev) => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                quantityOrdered: newQty,
                totalPrice: unitPrice ? (newQty * parseFloat(unitPrice)).toFixed(2) : ''
            }
        }));
    };

    const handleDecrement = () => {
        const newQty = Math.max(1, formData.currentItem.quantityOrdered - 1);
        const unitPrice = formData.currentItem.unitPrice;
        setFormData((prev) => ({
            ...prev,
            currentItem: {
                ...prev.currentItem,
                quantityOrdered: newQty,
                totalPrice: unitPrice ? (newQty * parseFloat(unitPrice)).toFixed(2) : ''
            }
        }));
    };

    const handleAddItem = () => {
        const { currentItem } = formData;
        if (!currentItem.itemId || !currentItem.unitPrice || currentItem.quantityOrdered < 1) return;

        setFormData((prev) => ({
            ...prev,
            poItems: [...prev.poItems, { ...currentItem, id: Date.now() }],
            currentItem: {
                itemId: '',
                itemName: '',
                unitOfMeasurement: '',
                quantityOrdered: 1,
                unitPrice: '',
                totalPrice: ''
            }
        }));
    };

    const handleRemoveItem = (id) => {
        setFormData((prev) => ({ ...prev, poItems: prev.poItems.filter((item) => item.id !== id) }));
    };

    const handleSubmit = () => {
        if (!formData.officeId) return;

        const itemsToSubmit = [...formData.poItems];
        if (formData.currentItem.itemId && formData.currentItem.unitPrice) {
            itemsToSubmit.push({ ...formData.currentItem, id: Date.now() });
        }

        if (itemsToSubmit.length === 0) return;

        setSubmitError('');
        createPurchaseOrder({
            officeId: formData.officeId,
            office: formData.office,
            user: formData.user,
            date: formData.date || new Date().toISOString(),
            expectedDeliveryDate: formData.expectedDeliveryDate,
            taxAmount: formData.taxAmount,
            shippingCost: formData.shippingCost,
            discountAmount: formData.discountAmount,
            notes: formData.notes,
            poItems: itemsToSubmit.map((item) => ({
                itemId: item.itemId,
                itemName: item.itemName,
                unitOfMeasurement: item.unitOfMeasurement,
                quantityOrdered: item.quantityOrdered,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),
        });
    };

    const handleDelete = (itemId) => {
        const resolvedId = getPurchaseOrderId(itemId);
        if (!resolvedId) return;
        setDeleteModal({ isOpen: true, poId: resolvedId });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.poId) return;
        deletePurchaseOrder(deleteModal.poId);
    };

    return (
        <div className="bg-white p-8 min-h-screen scrollbar-hide m-5 rounded-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90"
                >
                    <Plus size={18} />
                    Add Purchase Order
                </button>
            </div>

            {submitError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            <div className="pb-6 md:pb-8">
                <DataTable
                    isLoading={purchaseOrdersQuery.isLoading || officesQuery.isLoading || itemsQuery.isLoading}
                    error={purchaseOrdersQuery.error?.message || officesQuery.error?.message || itemsQuery.error?.message || null}
                    items={filteredOrders}
                    columns={tableColumns}
                    showView={true}
                    showEdit={false}
                    showDelete={true}
                    showToggle={false}
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    onView={(item) => setPreviewPO(item)}
                    onDelete={handleDelete}
                    tabName="Purchase Order"
                />
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Add New Purchase Order</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FieldWrapper label="Office" required className="text-sm">
                                    <Select
                                        placeholder="Select Office"
                                        value={formData.officeId}
                                        onChange={(e) => {
                                            const selected = offices.find((o) => String(o.id) === String(e.target.value));
                                            setFormData((prev) => ({
                                                ...prev,
                                                officeId: e.target.value,
                                                office: selected?.branchName || ''
                                            }));
                                        }}
                                        className="text-sm"
                                        options={officeOptions}
                                    >
                                    </Select>
                                </FieldWrapper>

                                <FieldWrapper label="User" required className="text-sm">
                                    <Input value={formData.user} disabled placeholder="Auto" className="text-sm py-2 bg-gray-50" />
                                </FieldWrapper>

                                <FieldWrapper label="Date & Time" required className="text-sm">
                                    <Input type="datetime-local" value={formData.date} disabled placeholder="Auto" className="text-sm py-2 bg-gray-50" />
                                </FieldWrapper>
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FieldWrapper label="Item Name" required className="text-sm">
                                        <Select
                                            placeholder="Select Item"
                                            value={formData.currentItem.itemId}
                                            onChange={(e) => {
                                                const selected = normalizedItems.find((item) => String(item.id) === String(e.target.value));
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    currentItem: {
                                                        ...prev.currentItem,
                                                        itemId: selected?.id || '',
                                                        itemName: selected?.name || '',
                                                        unitPrice: selected?.price ? String(selected.price) : prev.currentItem.unitPrice,
                                                        unitOfMeasurement: selected?.unitOfMeasurement || ''
                                                    }
                                                }));
                                            }}
                                            className="text-sm"
                                            options={itemOptions}
                                        >
                                        </Select>
                                    </FieldWrapper>

                                    <FieldWrapper label="Unit of Measurement" className="text-sm">
                                        <Input value={formData.currentItem.unitOfMeasurement} disabled placeholder="Auto" className="text-sm py-2 bg-gray-50" />
                                    </FieldWrapper>
                                </div>

                                <FieldWrapper label="Quantity Ordered" required className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleDecrement} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold cursor-pointer">−</button>
                                        <Input type="number" value={formData.currentItem.quantityOrdered} onChange={handleQuantityChange} min="1" className="text-sm py-2 text-center flex-1" />
                                        <button onClick={handleIncrement} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-semibold cursor-pointer">+</button>
                                    </div>
                                </FieldWrapper>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FieldWrapper label="Unit Price" required className="text-sm">
                                        <Input type="number" value={formData.currentItem.unitPrice} onChange={handleUnitPriceChange} placeholder="0.00" step="0.01" min="0" className="text-sm py-2" />
                                    </FieldWrapper>
                                    <FieldWrapper label="Total Price" className="text-sm">
                                        <Input value={formData.currentItem.totalPrice} disabled placeholder="Auto calculated" className="text-sm py-2 bg-gray-50" />
                                    </FieldWrapper>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="rounded-lg border border-customBlue px-4 py-2 text-sm font-medium text-customBlue hover:bg-blue-50"
                                    >
                                        Add Item
                                    </button>
                                </div>

                            </div>

                            {formData.poItems.length > 0 && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-base font-semibold text-gray-800 mb-4">Review Details</h3>
                                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Item Name</th>
                                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Qty</th>
                                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.poItems.map((item, index) => (
                                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-700">{item.itemName}</td>
                                                        <td className="py-3 px-4 text-sm font-semibold text-gray-700">{item.quantityOrdered}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-700">{item.unitPrice}</td>
                                                        <td className="py-3 px-4 text-sm font-semibold text-gray-700">{item.totalPrice}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 font-bold text-base">✕</button>
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
                                onClick={handleSubmit}
                                disabled={isCreating}
                                className="w-40 py-3.5 bg-customBlue text-white hover:bg-customBlue/90 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isCreating && <Loader size={16} className="animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewPO && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Purchase Order Details</h2>
                            <button onClick={() => setPreviewPO(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    ['Store', previewPO.store],
                                    ['User', previewPO.userId],
                                    ['PR #', previewPO.purchasedRequestNo],
                                    ['PO #', previewPO.purchaseOrderNo],
                                    ['Created On', previewPO.createdOn],
                                    ['Approval Status', previewPO.approvalStatus],
                                    ['Delivery Status', previewPO.deliveryStatus],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                                        <p className="text-sm text-gray-900">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                            <button
                                onClick={() => setPreviewPO(null)}
                                className="w-40 py-3.5 bg-customBlue text-white hover:bg-customBlue/90 rounded-lg text-sm font-medium transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Confirm Delete</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <p className="text-gray-600">Are you sure you want to delete this purchase order? This action cannot be undone.</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, poId: null })}
                                className="w-40 py-3.5 border border-customBlue text-customBlue hover:bg-gray-50 rounded-lg text-sm font-medium transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="w-40 py-3.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting && <Loader size={16} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrderPage;