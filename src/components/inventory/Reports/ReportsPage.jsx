'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);
        setData([]);
        setIsLoading(false);
    };

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

    const handleView = (id) => {
        toast.success(`View item #${id}`);
    };

    const handleEdit = (id) => {
        toast.success(`Edit item #${id}`);
    };

    const handleDelete = (id) => {
        setData(data.filter(item => item.id !== id));
        toast.success('Item deleted successfully');
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
            {/* Search and Filter Bar */}
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex items-center bg-gray-100 rounded-lg w-80 px-4 py-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Item"
                        className="bg-transparent ml-3 w-full outline-none text-gray-600 placeholder-gray-400 text-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <button className="border border-gray-300 p-2.5 rounded-lg hover:bg-gray-100 transition">
                    <Filter size={18} className="text-gray-600" />
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                {currentData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="font-medium">No records found</p>
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
                            <th className="py-4 px-6 font-semibold text-gray-700 text-sm text-left">Action</th>
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
                                <td className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(item.id)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full transition flex items-center justify-center"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition flex items-center justify-center"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition flex items-center justify-center"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
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
