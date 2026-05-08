"use client";

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import EditModal from '@/components/components/EditModal';
import { useCategories } from '@/hooks/inventory/setup/useCategories';
import { useSubCategories } from '@/hooks/inventory/setup/useSubCategories';
import { useCreateSubCategory } from '@/hooks/inventory/setup/useCreateSubCategory';
import { useUpdateSubCategory } from '@/hooks/inventory/setup/useUpdateSubCategory';
import { useDeleteSubCategory } from '@/hooks/inventory/setup/useDeleteSubCategory';

const AddSubCategoryPage = ({ onStepChange, onMarkCompleted }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        categoryId: '',
        subCategoryName: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [editSubCategoryName, setEditSubCategoryName] = useState('');
    const [submitError, setSubmitError] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.items)) return data.items;
        return [];
    };

    const categoriesQuery = useCategories();
    const categories = useMemo(
        () => normalizeList(categoriesQuery.data).map((category) => ({
            ...category,
            id: category.id ?? category.categoryId ?? category._id,
            categoryName: category.categoryName || category.name || '',
            name: category.name || category.categoryName || '',
        })),
        [categoriesQuery.data]
    );

    const subcategoriesQuery = useSubCategories();
    const subcategories = useMemo(() => normalizeList(subcategoriesQuery.data), [subcategoriesQuery.data]);
    const normalizedSubcategories = useMemo(
        () => subcategories.map((s) => ({
            ...s,
            id: s.id ?? s.subCategoryId ?? s._id,
            subCategoryName: s.subCategoryName || s.name || '',
            categoryId: s.categoryId ?? s.category?.id ?? s.category_id ?? null,
        })),
        [subcategories]
    );

    const loading = subcategoriesQuery.isLoading || categoriesQuery.isLoading;
    const tableError = subcategoriesQuery.error?.message || null;

    const { mutate: createSubCategory, isPending: isCreating } = useCreateSubCategory({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-subcategories'] });
        },
        onError: (error) => {
            setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create subcategory.');
        },
    });

    const { mutate: updateSubCategory, isPending: isUpdating } = useUpdateSubCategory({
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['inventory-subcategories'] });
            const previous = queryClient.getQueryData(['inventory-subcategories']);
            queryClient.setQueryData(['inventory-subcategories'], (current) => {
                const list = normalizeList(current);
                return list.map((it) => (String(it.id) === String(id) ? { ...it, ...data } : it));
            });
            return { previous };
        },
        onError: (error, variables, context) => {
            if (context?.previous !== undefined) queryClient.setQueryData(['inventory-subcategories'], context.previous);
            setUpdateError(error?.response?.data?.message || error?.message || 'Failed to update subcategory.');
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-subcategories'] });
        },
    });

    const { mutate: deleteSubCategory } = useDeleteSubCategory({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-subcategories'] });
        },
    });

    const filteredSubcategories = normalizedSubcategories.filter(sub =>
        sub.subCategoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableColumns = [
        { key: 'subCategoryName', label: 'Subcategory Name', width: '50%' },
        {
            key: 'categoryId',
            label: 'Category',
            width: '30%',
            render: (it) => categories.find(c => String(c.id) === String(it.categoryId))?.categoryName || 'N/A'
        },
        {
            key: 'isActive',
            label: 'Status',
            width: '20%',
            render: (it) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                    it.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                    {it.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subCategoryName || !formData.categoryId) {
            setSubmitError('Category and Subcategory name are required.');
            return;
        }

        setSubmitError(null);
        createSubCategory(
            {
                categoryId: Number(formData.categoryId),
                subCategoryName: formData.subCategoryName,
            },
            {
                onSuccess: () => {
                    onMarkCompleted?.('add-subcategory');
                    setFormData({
                        categoryId: '',
                        subCategoryName: ''
                    });
                },
            }
        );
    };

    const handleCancel = () => {
        setFormData({
            categoryId: '',
            subCategoryName: ''
        });
    };

    const handleEdit = (sub) => {
        setSelectedSubcategory(sub);
        setEditSubCategoryName(sub.subCategoryName || '');
        setUpdateError(null);
        setShowEditModal(true);
    };

    const handleUpdateSubCategory = (onSuccess) => {
        if (!editSubCategoryName.trim()) {
            setUpdateError('Subcategory name is required.');
            return;
        }

        updateSubCategory(
            {
                id: selectedSubcategory.id,
                data: {
                    subCategoryName: editSubCategoryName,
                    categoryId: selectedSubcategory.categoryId,
                    isActive: selectedSubcategory.isActive,
                },
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedSubcategory(null);
                    onSuccess?.();
                },
            }
        );
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedSubcategory(null);
        setEditSubCategoryName('');
        setUpdateError(null);
    };

    const handleToggleStatus = (sub) => {
        updateSubCategory({
            id: sub.id,
            data: {
                subCategoryName: sub.subCategoryName,
                categoryId: sub.categoryId,
                isActive: !sub.isActive,
            },
        });
    };

    const handleDelete = (subId) => {
        deleteSubCategory(subId);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Subcategory</h1>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading subcategories...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <FieldWrapper label="Category" required className="text-sm">
                                    <Select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        options={categories.map(c => ({ value: String(c.id), label: c.categoryName }))}
                                        placeholder="Select category"
                                        className="text-sm"
                                    />
                                </FieldWrapper>
                            </div>
                            <div className="space-y-1">
                                <FieldWrapper label="Subcategory Name" required className="text-sm">
                                    <Input
                                        name="subCategoryName"
                                        value={formData.subCategoryName}
                                        onChange={handleInputChange}
                                        placeholder="Type subcategory name"
                                        className="text-sm py-2"
                                    />
                                </FieldWrapper>
                            </div>
                        </div>

                        <div className="flex gap-3 md:pt-4 mt-4 md:mt-6 justify-end">
                            <button
                                onClick={handleCancel}
                                className="w-40 py-3.5 border border-customBlue text-customBlue hover:bg-gray-50 rounded-lg text-md font-medium transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isCreating}
                                className="w-40 py-3.5 bg-customBlue text-white hover:bg-customBlue/90 rounded-lg text-md font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isCreating && <Loader size={18} className="animate-spin" />}
                                Save
                            </button>
                        </div>
                        {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
                    </div>

                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Subcategories Table */}
                    <div className="pb-6 md:pb-8">
                        <DataTable
                            isLoading={loading}
                            error={tableError}
                            items={filteredSubcategories}
                            columns={tableColumns}
                            showView={false}
                            showEdit={true}
                            showDelete={true}
                            showToggle={true}
                            searchQuery={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggle={handleToggleStatus}
                            tabName="Subcategory"
                        />
                    </div>
                </>
            )}

            {/* Edit Modal */}
            <EditModal
                isOpen={showEditModal}
                selectedItem={selectedSubcategory}
                onUpdate={handleUpdateSubCategory}
                onClose={handleCloseEditModal}
                isUpdating={isUpdating}
                error={updateError}
                title="Edit Subcategory"
                itemType="subcategory"
                fields={[
                    { label: "Subcategory Name", value: editSubCategoryName, onChange: setEditSubCategoryName },
                ]}
            />
        </div>
    );
};

export default AddSubCategoryPage;
