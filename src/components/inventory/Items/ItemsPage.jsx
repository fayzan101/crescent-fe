"use client";

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Loader, X } from 'lucide-react';
import DataTable from '../../components/DataTable';
import FieldWrapper from '../../ui/FieldWrapper';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import EditModal from '@/components/components/EditModal';
import { useItems } from '@/hooks/inventory/items/useItems';
import { useCreateItem } from '@/hooks/inventory/items/useCreateItem';
import { useUpdateItem } from '@/hooks/inventory/items/useUpdateItem';
import { useDeleteItem } from '@/hooks/inventory/items/useDeleteItem';
import { useCategories } from '@/hooks/inventory/setup/useCategories';
import { useGroups } from '@/hooks/inventory/setup/useGroups';
import { useStores } from '@/hooks/inventory/setup/useStores';

const ItemsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editName, setEditName] = useState('');
    const [editSku, setEditSku] = useState('');
    const [editCategoryId, setEditCategoryId] = useState('');
    const [editGroupId, setEditGroupId] = useState('');
    const [editDefaultStoreId, setEditDefaultStoreId] = useState('');
    const [editUom, setEditUom] = useState('');
    const [editReorderLevel, setEditReorderLevel] = useState('');
    const [updateError, setUpdateError] = useState(null);

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (!data || typeof data !== 'object') return [];

        const preferredKeys = ['data', 'items', 'results', 'list', 'rows', 'categories', 'groups', 'stores', 'content'];
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

    const setItemsQueryData = (updater) => {
        queryClient.setQueryData(['inventory-items'], (current) => {
            const currentList = normalizeList(current);
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;

            if (Array.isArray(current)) return nextList;
            if (Array.isArray(current?.data)) return { ...current, data: nextList };
            if (Array.isArray(current?.items)) return { ...current, items: nextList };

            return nextList;
        });
    };

    const getItemId = (item) => {
        if (!item) return null;
        if (typeof item === 'string' || typeof item === 'number') return item;
        return item.id ?? item.itemId ?? item._id ?? null;
    };

    const itemsQuery = useItems();
    const categoriesQuery = useCategories();
    const groupsQuery = useGroups();
    const storesQuery = useStores();

    const { mutate: createItem, isPending: isCreating } = useCreateItem({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        },
        onError: (error) => {
            setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create item.');
        },
    });

    const { mutate: updateItem, isPending: isUpdating } = useUpdateItem({
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['inventory-items'] });
            const previousItems = queryClient.getQueryData(['inventory-items']);

            setItemsQueryData((currentList) =>
                currentList.map((item) => {
                    if (String(getItemId(item)) !== String(id)) return item;
                    return {
                        ...item,
                        ...data,
                        id: getItemId(item) ?? id,
                        itemName: data.itemName ?? item.itemName ?? item.name,
                        name: data.itemName ?? item.name ?? item.itemName,
                        uom: data.uom ?? item.uom ?? item.unitOfMeasurement,
                        unitOfMeasurement: data.uom ?? item.unitOfMeasurement ?? item.uom,
                    };
                })
            );

            return { previousItems };
        },
        onError: (error, variables, context) => {
            if (context?.previousItems !== undefined) {
                queryClient.setQueryData(['inventory-items'], context.previousItems);
            }
            setUpdateError(error?.response?.data?.message || error?.message || 'Failed to update item.');
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        },
    });

    const { mutate: deleteItem } = useDeleteItem({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        },
    });

    const items = useMemo(() => normalizeList(itemsQuery.data), [itemsQuery.data]);
    const categories = useMemo(
        () => normalizeList(categoriesQuery.data).map((category) => ({
            ...category,
            id: category.id ?? category.categoryId ?? category._id ?? category.category_id,
            name: category.categoryName || category.name || category.title || '',
        })),
        [categoriesQuery.data]
    );
    const groups = useMemo(
        () => normalizeList(groupsQuery.data).map((group) => ({
            ...group,
            id: group.id ?? group.groupId ?? group._id ?? group.group_id,
            name: group.groupName || group.name || group.title || '',
        })),
        [groupsQuery.data]
    );
    const stores = useMemo(
        () => normalizeList(storesQuery.data).map((store) => ({
            ...store,
            id: store.id ?? store.storeId ?? store._id ?? store.store_id,
            name: store.storeName || store.name || store.title || '',
        })),
        [storesQuery.data]
    );

    const categoryOptions = useMemo(
        () => categories
            .filter((category) => category.id !== undefined && category.id !== null && category.name)
            .map((category) => ({ value: String(category.id), label: category.name })),
        [categories]
    );

    const groupOptions = useMemo(
        () => groups
            .filter((group) => group.id !== undefined && group.id !== null && group.name)
            .map((group) => ({ value: String(group.id), label: group.name })),
        [groups]
    );

    const storeOptions = useMemo(
        () => stores
            .filter((store) => store.id !== undefined && store.id !== null && store.name)
            .map((store) => ({ value: String(store.id), label: store.name })),
        [stores]
    );

    const normalizedItems = useMemo(
        () => items.map((item) => ({
            ...item,
            id: item.id ?? item.itemId ?? item._id,
            itemName: item.itemName || item.name || '',
            name: item.name || item.itemName || '',
            uom: item.uom || item.unitOfMeasurement || '',
            categoryId: item.categoryId ?? item.category?.id ?? item.category?.categoryId ?? 0,
            groupId: item.groupId ?? item.group?.id ?? item.group?.groupId ?? 0,
            reorderLevel: item.reorderLevel ?? 0,
            isActive: item.isActive ?? true,
            defaultStoreId: item.defaultStoreId ?? item.storeId ?? item.store?.id ?? item.store?.storeId ?? 0,
        })),
        [items]
    );
    const loading = itemsQuery.isLoading || categoriesQuery.isLoading || groupsQuery.isLoading || storesQuery.isLoading;
    const tableError = itemsQuery.error?.message || null;

    const emptyForm = {
        itemName: '',
        sku: '',
        categoryId: '',
        groupId: '',
        defaultStoreId: '',
        uom: '',
        reorderLevel: '',
        isActive: true,
    };

    const [formData, setFormData] = useState(emptyForm);

    const getCategoryName = (categoryId) => categories.find(c => String(c.id) === String(categoryId))?.name || 'N/A';
    const getGroupName = (groupId) => groups.find(group => String(group.id) === String(groupId))?.name || 'N/A';

    const buildItemPayload = (data) => ({
        sku: data.sku,
        itemName: data.itemName,
        categoryId: Number(data.categoryId || 0),
        groupId: Number(data.groupId || 0),
        defaultStoreId: Number(data.defaultStoreId || 0),
        uom: data.uom,
        reorderLevel: data.reorderLevel === '' ? 0 : Math.max(0, Number(data.reorderLevel) || 0),
        isActive: data.isActive ?? true,
    });

    const tableColumns = [
        { key: 'itemName', label: 'Item Name', width: '24%' },
        { key: 'sku', label: 'SKU', width: '14%' },
        {
            key: 'categoryId', label: 'Category', width: '12%',
            render: (item) => getCategoryName(item.categoryId)
        },
        {
            key: 'groupId', label: 'Group', width: '12%',
            render: (item) => getGroupName(item.groupId)
        },
                { key: 'uom', label: 'UOM', width: '10%' },
                { key: 'reorderLevel', label: 'Reorder Level', width: '10%' },
                {
                        key: 'isActive',
                        label: 'Status',
                        width: '10%',
                        render: (item) => (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                    item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                        )
                }
    ];

    const handleAddItemClick = () => {
        setFormData(emptyForm);
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setFormData(emptyForm);
        setSubmitError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'reorderLevel') {
            const safeValue = value === '' ? '' : String(Math.max(0, Number(value) || 0));
            setFormData(prev => ({ ...prev, [name]: safeValue }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitForm = async () => {
        if (!formData.itemName || !formData.sku || !formData.categoryId || !formData.defaultStoreId || !formData.uom) return;
        setSubmitError(null);
        createItem(buildItemPayload(formData), {
            onSuccess: () => {
                handleCloseAddModal();
            },
        });
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setEditName(item.itemName || item.name || '');
        setEditSku(item.sku || '');
        setEditCategoryId(String(item.categoryId ?? ''));
        setEditGroupId(String(item.groupId ?? ''));
        setEditDefaultStoreId(String(item.defaultStoreId ?? ''));
        setEditUom(item.uom || item.unitOfMeasurement || '');
        setEditReorderLevel(String(item.reorderLevel ?? ''));
        setUpdateError(null);
        setShowEditModal(true);
    };

    const handleUpdateItem = (onSuccess) => {
        if (!editName.trim() || !editSku.trim() || !editCategoryId || !editDefaultStoreId || !editUom.trim()) {
            setUpdateError('Item Name, SKU, Category, Default Store and UOM are required.');
            return;
        }
        setUpdateError(null);
        updateItem(
            {
                id: selectedItem.id,
                data: buildItemPayload({
                    itemName: editName,
                    sku: editSku,
                    categoryId: editCategoryId,
                    groupId: editGroupId,
                    defaultStoreId: editDefaultStoreId,
                    uom: editUom,
                    reorderLevel: editReorderLevel,
                    isActive: selectedItem.isActive ?? true,
                }),
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    onSuccess?.();
                },
            }
        );
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedItem(null);
        setEditName('');
        setEditSku('');
        setEditCategoryId('');
        setEditGroupId('');
        setEditDefaultStoreId('');
        setEditUom('');
        setEditReorderLevel('');
        setUpdateError(null);
    };

    const handleDelete = (itemId) => {
        deleteItem(itemId);
    };

    const handleToggle = (item, index, nextValue) => {
        const targetItem = normalizedItems.find((entry) => String(entry.id) === String(item?.id ?? item));
        if (!targetItem) return;

        updateItem({
            id: targetItem.id,
            data: buildItemPayload({
                itemName: targetItem.itemName,
                sku: targetItem.sku,
                categoryId: targetItem.categoryId,
                groupId: targetItem.groupId,
                defaultStoreId: targetItem.defaultStoreId,
                uom: targetItem.uom,
                reorderLevel: targetItem.reorderLevel,
                isActive: typeof nextValue === 'boolean' ? nextValue : !targetItem.isActive,
            }),
        });
    };

    return (
        <div className="bg-white p-8 min-h-screen scrollbar-hide m-5 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Items</h1>
                <button
                    onClick={handleAddItemClick}
                    className="flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90"
                >
                    <Plus size={18} />
                    Add New Item
                </button>
            </div>

            {/* Table */}
            <DataTable
                isLoading={loading}
                error={tableError}
                items={normalizedItems}
                columns={tableColumns}
                showView={false}
                showEdit={true}
                showDelete={true}
                showToggle={true}
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                tabName="Item"
            />

            {/* ── Add New Item Modal ── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>

                        {/* Sticky Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h2 className="text-base font-semibold text-gray-900">Add New Item</h2>
                            <button onClick={handleCloseAddModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <FieldWrapper label="Item Name" className="text-xs" required={true}>
                                        <Input name="itemName" value={formData.itemName} onChange={handleFormChange} placeholder="Enter item name" className="text-sm" />
                                    </FieldWrapper>
                                    <FieldWrapper label="SKU" className="text-xs" required={true}>
                                        <Input name="sku" value={formData.sku} onChange={handleFormChange} placeholder="Enter SKU" className="text-sm" />
                                    </FieldWrapper>
                                    <FieldWrapper label="Category" className="text-xs" required={true}>
                                        <Select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleFormChange}
                                            options={categoryOptions}
                                            placeholder="Select category"
                                            className="text-sm"
                                        />
                                    </FieldWrapper>
                                    <FieldWrapper label="Item Group" className="text-xs" required={true}>
                                        <Select
                                            name="groupId"
                                            value={formData.groupId}
                                            onChange={handleFormChange}
                                            options={groupOptions}
                                            placeholder="Select group"
                                            className="text-sm"
                                        />
                                    </FieldWrapper>
                                    <FieldWrapper label="UOM" className="text-xs" required={true}>
                                        <Input name="uom" value={formData.uom} onChange={handleFormChange} placeholder="e.g. pcs, kg, box" className="text-sm" />
                                    </FieldWrapper>
                                </div>

                                <div className="space-y-4">
                                    <FieldWrapper label="Reorder Level" className="text-xs" required={true}>
                                        <Input type="number" min="0" name="reorderLevel" value={formData.reorderLevel} onChange={handleFormChange} placeholder="0" className="text-sm" />
                                    </FieldWrapper>
                                    <FieldWrapper label="Default Store" className="text-xs" required={true}>
                                        <Select
                                            name="defaultStoreId"
                                            value={formData.defaultStoreId}
                                            onChange={handleFormChange}
                                            options={storeOptions}
                                            placeholder="Select store"
                                            className="text-sm"
                                        />
                                    </FieldWrapper>
                                </div>
                            </div>

                            {submitError && (
                                <p className="mt-4 text-sm text-red-600">{submitError}</p>
                            )}
                        </div>

                        {/* Sticky Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                            <button
                                onClick={handleCloseAddModal}
                                className="w-40 py-3.5 border border-customBlue text-customBlue hover:bg-gray-50 rounded-lg text-sm font-medium transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitForm}
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

            {/* Edit Modal */}
            <EditModal
                isOpen={showEditModal}
                selectedItem={selectedItem}
                onUpdate={handleUpdateItem}
                onClose={handleCloseEditModal}
                isUpdating={isUpdating}
                error={updateError}
                title="Edit Item"
                itemType="item"
                fields={[
                    { label: "Item Name",     value: editName,         onChange: setEditName         },
                    { label: "SKU",           value: editSku,          onChange: setEditSku          },
                    {
                        label: "Category",
                        value: editCategoryId,
                        onChange: setEditCategoryId,
                        type: "select",
                        options: categoryOptions,
                    },
                    {
                        label: "Item Group",
                        value: editGroupId,
                        onChange: setEditGroupId,
                        type: "select",
                        options: groupOptions,
                    },
                    {
                        label: "Default Store",
                        value: editDefaultStoreId,
                        onChange: setEditDefaultStoreId,
                        type: "select",
                        options: storeOptions,
                    },
                    { label: "UOM",           value: editUom,          onChange: setEditUom          },
                    {
                        label: "Reorder Level",
                        value: editReorderLevel,
                        onChange: (value) => setEditReorderLevel(value === '' ? '' : String(Math.max(0, Number(value) || 0))),
                    },
                ]}
            />
        </div>
    );
};

export default ItemsPage;