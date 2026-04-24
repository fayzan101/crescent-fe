"use client";

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import EditModal from '@/components/components/EditModal';
import { useCategories } from '@/hooks/inventory/setup/useCategories';
import { useCreateCategory } from '@/hooks/inventory/setup/useCreateCategory';
import { useUpdateCategory } from '@/hooks/inventory/setup/useUpdateCategory';
import { useDeleteCategory } from '@/hooks/inventory/setup/useDeleteCategory';

const AddCategoryPage = ({ onStepChange, onMarkCompleted }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        categoryName: '',
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [updateError, setUpdateError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.items)) return data.items;
        return [];
    };

    const setCategoriesQueryData = (updater) => {
        queryClient.setQueryData(['inventory-categories'], (current) => {
            const currentList = normalizeList(current);
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;

            if (Array.isArray(current)) return nextList;
            if (Array.isArray(current?.data)) return { ...current, data: nextList };
            if (Array.isArray(current?.items)) return { ...current, items: nextList };

            return nextList;
        });
    };

    const categoriesQuery = useCategories();
    const categories = useMemo(() => normalizeList(categoriesQuery.data), [categoriesQuery.data]);
    const normalizedCategories = useMemo(
        () => categories.map((category) => ({
            ...category,
            id: category.id ?? category.categoryId ?? category._id,
            categoryName: category.categoryName || category.name || '',
            name: category.name || category.categoryName || '',
        })),
        [categories]
    );
    const loading = categoriesQuery.isLoading;
    const tableError = categoriesQuery.error?.message || null;

    const { mutate: createCategory, isPending: isCreating } = useCreateCategory({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
        },
        onError: (error) => {
            setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create category.');
        },
    });

    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory({
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['inventory-categories'] });
            const previousCategories = queryClient.getQueryData(['inventory-categories']);

            setCategoriesQueryData((currentList) =>
                currentList.map((category) => {
                    if (String(getCategoryId(category)) !== String(id)) return category;
                    return {
                        ...category,
                        ...data,
                        id: getCategoryId(category) ?? id,
                    };
                })
            );

            return { previousCategories };
        },
        onError: (error, variables, context) => {
            if (context?.previousCategories !== undefined) {
                queryClient.setQueryData(['inventory-categories'], context.previousCategories);
            }
            setUpdateError(error?.response?.data?.message || error?.message || 'Failed to update category.');
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
        },
    });

    const { mutate: deleteCategory } = useDeleteCategory({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
        },
    });

    const filteredCategories = normalizedCategories.filter(category =>
        category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableColumns = [
        { key: 'categoryName', label: 'Category Name', width: '40%' },
        {
            key: 'isActive',
            label: 'Status',
            width: '15%',
            render: (item) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                  item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryName) {
            return;
        }

        setSubmitError(null);
        createCategory(
            {
                categoryName: formData.categoryName,
                isActive: formData.isActive,
            },
            {
                onSuccess: () => {
                    onMarkCompleted?.('add-category');
                    setFormData({
                        categoryName: '',
                        isActive: true
                    });
                },
            }
        );
    };

    const handleCancel = () => {
        setFormData({
            categoryName: '',
            isActive: true
        });
    };

    const getCategoryId = (category) => {
        if (!category) return null;
        if (typeof category === 'string' || typeof category === 'number') return category;
        return category.id ?? category.categoryId ?? category._id ?? null;
    };

    const handleToggleStatus = (category, index, nextValue) => {
        const categoryId = getCategoryId(category);
        const targetCategory = normalizedCategories.find((item) => String(item.id) === String(categoryId));
        if (!targetCategory) return;

        updateCategory({
            id: categoryId,
            data: {
                categoryName: targetCategory.categoryName,
                isActive: typeof nextValue === 'boolean' ? nextValue : !targetCategory.isActive,
            },
        });
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditCategoryName(category.categoryName || category.name || '');
        setUpdateError(null);
        setShowEditModal(true);
    };

    const handleUpdateCategory = (onSuccess) => {
        if (!editCategoryName.trim()) {
            setUpdateError('Category Name is required.');
            return;
        }

        updateCategory(
            {
                id: selectedCategory.id,
                data: {
                    categoryName: editCategoryName,
                    isActive: selectedCategory.isActive,
                },
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                    onSuccess?.();
                },
            }
        );
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
        setEditCategoryName('');
        setUpdateError(null);
    };

    const handleDelete = (categoryId) => {
        deleteCategory(categoryId);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Category</h1>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading categories...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <FieldWrapper label="Category Name" required className="text-sm">
                                    <Input
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleInputChange}
                                        placeholder="Type here"
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

                    {/* Categories Table */}
                    <div className="pb-6 md:pb-8">
                        <DataTable
                            isLoading={loading}
                            error={tableError}
                            items={filteredCategories}
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
                            tabName="Category"
                        />
                    </div>
                </>
            )}

            {/* Edit Modal — same pattern as AddOfficeTabContent */}
            <EditModal
                isOpen={showEditModal}
                selectedItem={selectedCategory}
                onUpdate={handleUpdateCategory}
                onClose={handleCloseEditModal}
                isUpdating={isUpdating}
                error={updateError}
                title="Edit Category"
                itemType="category"
                fields={[
                    { label: "Category Name", value: editCategoryName, onChange: setEditCategoryName },
                ]}
            />
        </div>
    );
};

export default AddCategoryPage;