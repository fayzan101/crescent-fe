'use client';
import React, { useState, useMemo } from 'react';
import { Filter, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/components/DataTable';
import FieldWrapper from '@/components/ui/FieldWrapper';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useDropdownItems } from '@/hooks/inventory/utility/useDropdownItems';
import { useDropdownStores } from '@/hooks/inventory/utility/useDropdownStores';
import {
    getInventoryCardReport,
    getIssuanceReport,
    getPurchaseReport,
    getReturnsReport,
    getStockReport,
    getTransfersReport,
} from '@/services/inventory-reports.service';

const REPORT_TYPE_OPTIONS = [
    { value: 'inventory-card', label: 'Inventory Card' },
    { value: 'stock', label: 'Stock Report' },
    { value: 'returns', label: 'Returns Report' },
    { value: 'transfers', label: 'Transfers Report' },
    { value: 'purchase', label: 'Purchase Report' },
];

const REPORT_FETCHERS = {
    'inventory-card': getInventoryCardReport,
    stock: getStockReport,
    issuance: getIssuanceReport,
    returns: getReturnsReport,
    transfers: getTransfersReport,
    purchase: getPurchaseReport,
};

const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];

    const preferredKeys = ['data', 'items', 'results', 'list', 'rows', 'content'];
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

const ReportsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [reportType, setReportType] = useState('inventory-card');
    const [filters, setFilters] = useState({
        itemId: '',
        storeId: '',
        dateFrom: '',
        dateTo: '',
    });
    const [activeParams, setActiveParams] = useState(null);
    const itemsQuery = useDropdownItems();
    const storesQuery = useDropdownStores();

    const itemOptions = useMemo(
        () =>
            normalizeList(itemsQuery.data).map((item) => ({
                value: String(item.id ?? item.itemId ?? item._id ?? item.value ?? ''),
                label: item.sku && item.name ? `${item.sku} - ${item.name}` : item.name || item.itemName || item.label || 'Unnamed Item',
            })),
        [itemsQuery.data]
    );

    const storeOptions = useMemo(
        () =>
            normalizeList(storesQuery.data).map((store) => ({
                value: String(store.id ?? store.storeId ?? store._id ?? store.value ?? ''),
                label: store.branchName || store.storeName || store.name || store.label || 'Unnamed Store',
            })),
        [storesQuery.data]
    );

    const { data: reportData, error: reportError, isLoading, isFetching } = useQuery({
        queryKey: ['inventory-report', reportType, activeParams],
        enabled: Boolean(activeParams),
        queryFn: () => {
            const fetcher = REPORT_FETCHERS[reportType] || getInventoryCardReport;
            return fetcher(activeParams || {});
        },
    });

    const data = useMemo(() => {
        const raw = Array.isArray(reportData)
            ? reportData
            : Array.isArray(reportData?.data)
                ? reportData.data
                : Array.isArray(reportData?.rows)
                    ? reportData.rows
                : [];
        return raw.map((item, idx) => ({
            id: item.id ?? item.inventoryCardId ?? idx + 1,
            store: item.store?.storeName || item.store || item.office || item.storeName || 'N/A',
            issueNo: item.issueNo || item.issuanceNo || item.referenceNo || 'N/A',
            serviceNo: item.serviceNo || item.guardServiceNo || 'N/A',
            displayName: item.name || item.item?.itemName || item.guardName || item.fullName || 'N/A',
            itemSKU: item.itemSKU || item.item?.sku || item.sku || 'N/A',
            itemGroup: item.itemGroup || item.groupName || item.referenceType || item.movementType || 'N/A',
            status: item.status || item.movementType || item.category || 'N/A',
            category: item.category || item.categoryName || item.item?.uom || 'N/A',
            name: [
                item.store?.storeName || item.store || item.office || item.storeName || 'N/A',
                item.issueNo || item.issuanceNo || item.referenceNo || 'N/A',
                item.serviceNo || item.guardServiceNo || 'N/A',
                item.name || item.item?.itemName || item.guardName || item.fullName || 'N/A',
                item.itemSKU || item.item?.sku || item.sku || 'N/A',
            ].join(' '),
        }));
    }, [reportData]);

    const reportSummary = useMemo(() => ({
        balance: reportData?.balance ?? null,
        totalIn: reportData?.totalIn ?? null,
        totalOut: reportData?.totalOut ?? null,
    }), [reportData]);

    const handleGenerateReport = () => {
        const builtParams = {};
        if (filters.itemId) builtParams.item_id = Number(filters.itemId);
        if (filters.storeId) builtParams.store_id = Number(filters.storeId);
        if (filters.dateFrom) builtParams.date_from = filters.dateFrom;
        if (filters.dateTo) builtParams.date_to = filters.dateTo;

        if (builtParams.item_id && builtParams.item_id < 1) {
            toast.error('Item ID must be greater than 0');
            return;
        }
        if (builtParams.store_id && builtParams.store_id < 1) {
            toast.error('Store ID must be greater than 0');
            return;
        }
        if (builtParams.date_from && builtParams.date_to && builtParams.date_from > builtParams.date_to) {
            toast.error('Date From cannot be after Date To');
            return;
        }

        setActiveParams(builtParams);
    };

    const handleResetFilters = () => {
        setFilters({ itemId: '', storeId: '', dateFrom: '', dateTo: '' });
        setActiveParams({});
        setSearchTerm('');
    };

    const handleChangeFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const activeReportLabel = useMemo(() => {
        return REPORT_TYPE_OPTIONS.find((opt) => opt.value === reportType)?.label || 'Inventory Card';
    }, [reportType]);

    const handleExport = () => {
        toast.success('Export will be added in next update.');
    };

    const reportColumns = useMemo(() => [
        { key: 'store', label: 'Store / Office', width: '18%' },
        { key: 'issueNo', label: 'Issue No.', width: '12%' },
        { key: 'serviceNo', label: 'Service No.', width: '12%' },
        { key: 'displayName', label: 'Name', width: '18%' },
        { key: 'itemSKU', label: 'Item SKU', width: '14%' },
        { key: 'itemGroup', label: 'Item Group', width: '14%' },
        {
            key: 'category',
            label: 'Category',
            width: '12%',
            render: (item) => (
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    item.status === 'ISSUED' || item.status === 'New'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'PARTIAL_RETURN'
                        ? 'bg-yellow-100 text-yellow-700'
                        : item.status === 'FULL_RETURN'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                    {item.status || item.category}
                </span>
            ),
        },
    ], []);

    return (
        <div className="bg-white min-h-screen p-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-blue-600" />
                        <p className="text-gray-600 font-medium">Loading reports...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-3 p-4 border border-gray-200 rounded-lg bg-gray-50 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end ">
                            <FieldWrapper label="Report Type" className="text-sm">
                                <Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    options={REPORT_TYPE_OPTIONS}
                                    className="text-sm"
                                />
                            </FieldWrapper>
                            <FieldWrapper label="Item" className="text-sm">
                                <Select
                                    value={filters.itemId}
                                    onChange={(e) => handleChangeFilter('itemId', e.target.value)}
                                    options={itemOptions}
                                    placeholder={itemsQuery.isLoading ? 'Loading items...' : 'Select Item'}
                                    className="text-sm"
                                    disabled={itemsQuery.isLoading}
                                />
                            </FieldWrapper>
                            <FieldWrapper label="Store" className="text-sm">
                                <Select
                                    value={filters.storeId}
                                    onChange={(e) => handleChangeFilter('storeId', e.target.value)}
                                    options={storeOptions}
                                    placeholder={storesQuery.isLoading ? 'Loading stores...' : 'Select Store'}
                                    className="text-sm"
                                    disabled={storesQuery.isLoading}
                                />
                            </FieldWrapper>
                            <FieldWrapper label="Date From" className="text-sm">
                                <Input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleChangeFilter('dateFrom', e.target.value)}
                                    className="text-sm py-2 cursor-pointer"
                                />
                            </FieldWrapper>
                            <FieldWrapper label="Date To" className="text-sm">
                                <Input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleChangeFilter('dateTo', e.target.value)}
                                    className="text-sm py-2 cursor-pointer"
                                />
                            </FieldWrapper>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end mb-6">
                        <button
                            onClick={handleGenerateReport}
                            className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-customBlue text-white font-semibold rounded-lg hover:bg-customBlue/90"
                        >
                            Generate
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-gray-700 border border-gray-700 font-semibold rounded-lg hover:bg-gray-100"
                        >
                            Reset
                        </button>
                    </div>

                    {/* <div className="flex justify-between items-center mb-6 gap-4">
                        <button onClick={handleExport} className="border border-gray-300 p-2.5 rounded-lg hover:bg-gray-100 transition">
                            <Filter size={18} className="text-gray-600" />
                        </button>
                    </div> */}

                    {reportError ? (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {reportError.message || 'Failed to load report data.'}
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-700">{activeReportLabel}</p>
                            {isFetching && (
                                <div className="text-xs text-blue-600 flex items-center gap-2">
                                    <Loader size={14} className="animate-spin" />
                                    Refreshing report...
                                </div>
                            )}
                        </div>

                        {(reportSummary.balance !== null || reportSummary.totalIn !== null || reportSummary.totalOut !== null) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
                                    <p className="text-xs text-gray-500">Balance</p>
                                    <p className="text-base font-semibold text-gray-900">{reportSummary.balance ?? 'N/A'}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
                                    <p className="text-xs text-gray-500">Total In</p>
                                    <p className="text-base font-semibold text-green-700">{reportSummary.totalIn ?? 'N/A'}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg px-3 py-2 bg-white">
                                    <p className="text-xs text-gray-500">Total Out</p>
                                    <p className="text-base font-semibold text-red-700">{reportSummary.totalOut ?? 'N/A'}</p>
                                </div>
                            </div>
                        )}

                        {!activeParams ? (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-600">
                                Generate a report to view data.
                            </div>
                        ) : (
                            <DataTable
                                isLoading={false}
                                error={null}
                                items={data}
                                columns={reportColumns}
                                showView={false}
                                showEdit={false}
                                showDelete={false}
                                showToggle={false}
                                searchQuery={searchTerm}
                                onSearchChange={setSearchTerm}
                                tabName={activeReportLabel}
                                itemsPerPage={itemsPerPage}
                            />
                        )}
                    </div>

                </>
            )}
        </div>
    );
};

export default ReportsPage;
