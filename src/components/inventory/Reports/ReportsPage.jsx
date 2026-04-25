'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
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

const ReportsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportType, setReportType] = useState('inventory-card');
    const [filters, setFilters] = useState({
        itemId: '',
        storeId: '',
        dateFrom: '',
        dateTo: '',
    });
    const [activeParams, setActiveParams] = useState(null);

    const { data: reportData, isLoading, isFetching } = useQuery({
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
            name: item.name || item.item?.itemName || item.guardName || item.fullName || 'N/A',
            itemSKU: item.itemSKU || item.item?.sku || item.sku || 'N/A',
            itemGroup: item.itemGroup || item.groupName || item.referenceType || item.movementType || 'N/A',
            status: item.status || item.movementType || item.category || 'N/A',
            category: item.category || item.categoryName || item.item?.uom || 'N/A',
        }));
    }, [reportData]);

    const reportSummary = useMemo(() => ({
        balance: reportData?.balance ?? null,
        totalIn: reportData?.totalIn ?? null,
        totalOut: reportData?.totalOut ?? null,
    }), [reportData]);

    // Filter data based on search
    const filteredData = useMemo(() => {
        return data.filter(item =>
            (item.store?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (item.issueNo?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (item.itemSKU?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (item.serviceNo?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

        setCurrentPage(1);
        setActiveParams(builtParams);
    };

    const handleResetFilters = () => {
        setFilters({ itemId: '', storeId: '', dateFrom: '', dateTo: '' });
        setActiveParams({});
        setSearchTerm('');
        setCurrentPage(1);
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

    // Pagination range display
    const paginationStart = Math.max(1, currentPage - 1);
    const paginationEnd = Math.min(totalPages, currentPage + 2);
    const paginationPages = Array.from({ length: paginationEnd - paginationStart + 1 }, (_, i) => paginationStart + i);

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
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                            {REPORT_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Item ID</label>
                        <input
                            type="number"
                            min="1"
                            value={filters.itemId}
                            onChange={(e) => handleChangeFilter('itemId', e.target.value)}
                            placeholder="Optional"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Store ID</label>
                        <input
                            type="number"
                            min="1"
                            value={filters.storeId}
                            onChange={(e) => handleChangeFilter('storeId', e.target.value)}
                            placeholder="Optional"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date From</label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleChangeFilter('dateFrom', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date To</label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleChangeFilter('dateTo', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateReport}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded"
                        >
                            Generate
                        </button>
                        <button
                            onClick={handleResetFilters}
                            className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex items-center bg-gray-100 rounded-lg w-80 px-4 py-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search in generated data"
                        className="bg-transparent ml-3 w-full outline-none text-gray-600 placeholder-gray-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <button onClick={handleExport} className="border border-gray-300 p-2.5 rounded-lg hover:bg-gray-100 transition">
                    <Filter size={18} className="text-gray-600" />
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700">{activeReportLabel}</p>
                    {isFetching && (
                        <div className="text-xs text-blue-600 flex items-center gap-2">
                            <Loader size={14} className="animate-spin" />
                            Refreshing report...
                        </div>
                    )}
                </div>
                {(reportSummary.balance !== null || reportSummary.totalIn !== null || reportSummary.totalOut !== null) && (
                    <div className="px-4 py-3 border-b border-gray-200 bg-white grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border border-gray-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-500">Balance</p>
                            <p className="text-base font-semibold text-gray-900">{reportSummary.balance ?? 'N/A'}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-500">Total In</p>
                            <p className="text-base font-semibold text-green-700">{reportSummary.totalIn ?? 'N/A'}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-500">Total Out</p>
                            <p className="text-base font-semibold text-red-700">{reportSummary.totalOut ?? 'N/A'}</p>
                        </div>
                    </div>
                )}
                {currentData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="font-medium">No records found. Generate a report to view data.</p>
                    </div>
                )}
                {currentData.length > 0 && (
                <table className="w-full">
                    <thead>
                        <tr className="bg-white border-b border-gray-200">
                            <th className="py-4 px-4 text-left">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Store / Office</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Issue No.</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Service No.</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Name</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Item SKU</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Item Group</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="py-4 px-4">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                </td>
                                <td className="py-4 px-6 text-gray-800 text-sm">{item.store}</td>
                                <td className="py-4 px-6 text-gray-700 text-sm font-semibold">{item.issueNo}</td>
                                <td className="py-4 px-6 text-gray-700 text-sm font-semibold">{item.serviceNo}</td>
                                <td className="py-4 px-6 text-gray-700 text-sm">{item.name}</td>
                                <td className="py-4 px-6 text-gray-700 text-sm font-semibold">{item.itemSKU}</td>
                                <td className="py-4 px-6 text-gray-700 text-sm">{item.itemGroup}</td>
                                <td className="py-4 px-6 text-sm">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">Showing</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm bg-white"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="text-center flex-1">
                    <span className="text-gray-600 text-sm">
                        Showing {Math.min(startIndex + 1, filteredData.length)} to {Math.min(endIndex, filteredData.length)} out of {filteredData.length} records
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

                    {paginationPages.map(page => (
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
                </>
            )}
        </div>
    );
};

export default ReportsPage;
