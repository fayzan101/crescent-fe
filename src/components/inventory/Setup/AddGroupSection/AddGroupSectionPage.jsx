"use client";

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import DataTable from '../../../components/DataTable';
import FieldWrapper from '../../../ui/FieldWrapper';
import Input from '../../../ui/Input';
import EditModal from '@/components/components/EditModal';
import { useGroups } from '@/hooks/inventory/setup/useGroups';
import { useCategories } from '@/hooks/inventory/setup/useCategories';
import { useCreateGroup } from '@/hooks/inventory/setup/useCreateGroup';
import { useUpdateGroup } from '@/hooks/inventory/setup/useUpdateGroup';
import { useDeleteGroup } from '@/hooks/inventory/setup/useDeleteGroup';

const AddGroupSectionPage = ({ onStepChange, onMarkCompleted }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        groupName: '',
        description: '',
        isActive: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editGroupName, setEditGroupName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [updateError, setUpdateError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.items)) return data.items;
        return [];
    };

    const setGroupsQueryData = (updater) => {
        queryClient.setQueryData(['inventory-groups'], (current) => {
            const currentList = normalizeList(current);
            const nextList = typeof updater === 'function' ? updater(currentList) : updater;

            if (Array.isArray(current)) return nextList;
            if (Array.isArray(current?.data)) return { ...current, data: nextList };
            if (Array.isArray(current?.items)) return { ...current, items: nextList };

            return nextList;
        });
    };

    const groupsQuery = useGroups();
    const categoriesQuery = useCategories();
    const groups = useMemo(() => normalizeList(groupsQuery.data), [groupsQuery.data]);
    const categories = useMemo(() => normalizeList(categoriesQuery.data), [categoriesQuery.data]);
    const normalizedGroups = useMemo(
        () => groups.map((group) => ({
            ...group,
            id: group.id ?? group.groupId ?? group._id,
            groupName: group.groupName || group.name || '',
            name: group.name || group.groupName || '',
        })),
        [groups]
    );
    const loading = groupsQuery.isLoading || categoriesQuery.isLoading;
    const tableError = groupsQuery.error?.message || null;

    const { mutate: createGroup, isPending: isCreating } = useCreateGroup({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-groups'] });
        },
        onError: (error) => {
            setSubmitError(error?.response?.data?.message || error?.message || 'Failed to create group.');
        },
    });

    const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup({
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['inventory-groups'] });
            const previousGroups = queryClient.getQueryData(['inventory-groups']);

            setGroupsQueryData((currentList) =>
                currentList.map((group) => {
                    if (String(getGroupId(group)) !== String(id)) return group;
                    return {
                        ...group,
                        ...data,
                        id: getGroupId(group) ?? id,
                    };
                })
            );

            return { previousGroups };
        },
        onError: (error, variables, context) => {
            if (context?.previousGroups !== undefined) {
                queryClient.setQueryData(['inventory-groups'], context.previousGroups);
            }
            setUpdateError(error?.response?.data?.message || error?.message || 'Failed to update group.');
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-groups'] });
        },
    });

    const { mutate: deleteGroup } = useDeleteGroup({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['inventory-groups'] });
        },
    });

    const filteredGroups = normalizedGroups.filter(group =>
        group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableColumns = [
        { key: 'groupName', label: 'Group/Section Name', width: '35%' },
        { key: 'description', label: 'Description', width: '35%' },
        {
            key: 'isActive',
            label: 'Status',
            width: '20%',
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

        if (!formData.groupName) {
            return;
        }

        setSubmitError(null);
        createGroup(
            {
                groupName: formData.groupName,
                description: formData.description,
                isActive: formData.isActive,
            },
            {
                onSuccess: () => {
                    onMarkCompleted?.('add-group-section');
                    setFormData({
                        groupName: '',
                        description: '',
                        isActive: true
                    });
                },
            }
        );
    };

    const handleCancel = () => {
        setFormData({
            groupName: '',
            description: '',
            isActive: true
        });
    };

    const getGroupId = (group) => {
        if (!group) return null;
        if (typeof group === 'string' || typeof group === 'number') return group;
        return group.id ?? group.groupId ?? group._id ?? null;
    };

    const handleToggleStatus = (group, index, nextValue) => {
        const groupId = getGroupId(group);
        const targetGroup = normalizedGroups.find((item) => String(item.id) === String(groupId));
        if (!targetGroup) return;

        updateGroup({
            id: groupId,
            data: {
                groupName: targetGroup.groupName,
                description: targetGroup.description,
                isActive: typeof nextValue === 'boolean' ? nextValue : !targetGroup.isActive,
            },
        });
    };

    const handleEdit = (group) => {
        setSelectedGroup(group);
        setEditGroupName(group.groupName || group.name || '');
        setEditDescription(group.description || '');
        setUpdateError(null);
        setShowEditModal(true);
    };

    const handleUpdateGroup = (onSuccess) => {
        if (!editGroupName.trim()) {
            setUpdateError('Group/Section Name is required.');
            return;
        }

        updateGroup(
            {
                id: selectedGroup.id,
                data: {
                    groupName: editGroupName,
                    description: editDescription,
                    isActive: selectedGroup.isActive,
                },
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedGroup(null);
                    onSuccess?.();
                },
            }
        );
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedGroup(null);
        setEditGroupName('');
        setEditDescription('');
        setUpdateError(null);
    };

    const handleDelete = (groupId) => {
        deleteGroup(groupId);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Group/Section</h1>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading groups...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form Section */}
                    <div className="mb-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <FieldWrapper label="Group/Section Name" required className="text-sm">
                                    <Input
                                        name="groupName"
                                        value={formData.groupName}
                                        onChange={handleInputChange}
                                        placeholder="Type here"
                                        className="text-sm py-2"
                                    />
                                </FieldWrapper>
                            </div>
                            <div className="space-y-1">
                                <FieldWrapper label="Description" className="text-sm">
                                    <Input
                                        name="description"
                                        value={formData.description}
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
                    </div>

                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Groups Table */}
                    <div className="pb-6 md:pb-8">
                        <DataTable
                            isLoading={loading}
                            error={tableError}
                            items={filteredGroups}
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
                            tabName="Group"
                        />
                    </div>
                </>
            )}

            {/* Edit Modal */}
            <EditModal
                isOpen={showEditModal}
                selectedItem={selectedGroup}
                onUpdate={handleUpdateGroup}
                onClose={handleCloseEditModal}
                isUpdating={isUpdating}
                error={updateError}
                title="Edit Group/Section"
                itemType="group"
                fields={[
                    { label: "Group/Section Name", value: editGroupName,   onChange: setEditGroupName   },
                    { label: "Description",         value: editDescription, onChange: setEditDescription },
                ]}
            />
        </div>
    );
};

export default AddGroupSectionPage;