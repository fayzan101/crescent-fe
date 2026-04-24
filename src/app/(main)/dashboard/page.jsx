"use client";
import React, { useState } from "react";
import { FaEdit, FaTrash, FaFilter, FaDownload, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Image from "next/image";

/* ================= PROVINCE CARD ================= */

const ProvinceStatsCard = ({ name, clients, vehicles, color, iconSrc }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div
        className="flex justify-between items-center px-3 py-2.5 rounded-md text-white text-sm font-semibold mb-3"
        style={{ backgroundColor: color }}
      >
        <span>{name}</span>
        <div className="bg-white p-1.5 rounded-md">
          <Image src={iconSrc} alt={name} width={18} height={18} />
        </div>
      </div>

      <div className="flex justify-between px-1">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Clients</p>
          <p className="text-lg font-semibold text-gray-800">{clients}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Vehicles</p>
          <p className="text-lg font-semibold text-gray-800">{vehicles}</p>
        </div>
      </div>
    </div>
  );
};

/* ================= LINE CHART ================= */

const LineChart = ({ color = "white" }) => {
  const points = [300, 380, 350, 480, 420, 520, 480, 580, 520, 620, 580, 660];
  const max = Math.max(...points);
  const width = 100;
  const height = 60;
  
  const pathPoints = points.map((val, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-32">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 20, 40, 60].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeOpacity="0.2"
            strokeDasharray="2,2"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={pathPoints}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((val, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - (val / max) * height;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
};

/* ================= BAR CHART ================= */

const BarChart = () => {
  const bars = [35, 65, 25, 75, 45, 85, 40, 70, 50, 80, 55, 75];
  
  return (
    <div className="flex items-end justify-between h-32 gap-1.5 px-3">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-white rounded-t-sm"
          style={{
            height: `${height}%`,
            opacity: 0.9
          }}
        />
      ))}
    </div>
  );
};

/* ================= PAGINATION ================= */

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between text-sm gap-4">
      <div className="text-gray-600 text-sm">
        Showing <span className="font-semibold">1</span> to <span className="font-semibold">4</span> of <span className="font-semibold">4</span> entries
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm">
          <FaChevronLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {[1, 2, 3, "...", 8, 9, 10].map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === 'number' && setCurrentPage(p)}
              disabled={p === "..."}
              className={`min-w-8 h-8 rounded transition-all text-sm ${
                p === currentPage
                  ? "bg-blue-600 text-white"
                  : p === "..."
                  ? "cursor-default"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm">
          <span className="hidden sm:inline">Next</span>
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

/* ================= MOBILE TABLE CARD (IMPROVED) ================= */

const MobileTableCard = ({ row, index }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
      {/* Header with initials and actions */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
            CW
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{row.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{row.city}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded">
            <FaEdit className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded">
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-medium">Contact Person</div>
          <div className="text-sm text-gray-800">{row.contact}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-medium">Email</div>
          <div className="text-sm text-blue-600 truncate max-w-45">{row.email}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-medium">Phone</div>
          <div className="text-sm text-gray-800">{row.phone}</div>
        </div>
      </div>
      
      {/* Address Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500 font-medium mb-1">Address</div>
        <div className="text-sm text-gray-800 leading-relaxed">{row.address}</div>
      </div>
      
      {/* Badges Section */}
      <div className="flex gap-2">
        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm font-medium border border-blue-100">
          {row.totalVehicles}
        </span>
        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded text-sm font-medium border border-green-100">
          {row.totalGroups}
        </span>
      </div>
    </div>
  );
};

/* ================= DATA ================= */

const provinces = [
  { 
    name: "Sindh", 
    clients: 200, 
    vehicles: 2000, 
    color: "#0fb9b1",
    iconSrc: "/Icons/SindhCardIcon.svg"
  },
  { 
    name: "Balochistan", 
    clients: 250, 
    vehicles: 2500, 
    color: "#20bf6b",
    iconSrc: "/Icons/BalochistanCardIcon.svg"
  },
  { 
    name: "Punjab", 
    clients: 300, 
    vehicles: 3000, 
    color: "#f7b731",
    iconSrc: "/Icons/PunjabCardIcon.svg"
  },
  { 
    name: "KPK", 
    clients: 350, 
    vehicles: 3500, 
    color: "#eb3b5a",
    iconSrc: "/Icons/KPKCardIcon.svg"
  },
  { 
    name: "Fata & GB", 
    clients: 400, 
    vehicles: 4500, 
    color: "#3867d6",
    iconSrc: "/Icons/FataCardIcon.svg"
  },
];

const tableData = [
  { 
    id: 1,
    name: "Candice Wu", 
    city: "Karachi", 
    contact: "Mr. Abdul Wahab", 
    email: "abc@mail.com", 
    phone: "+92 301 1234567",
    address: "Minnesota",
    totalVehicles: "PKR",
    totalGroups: "Hotel"
  },
  { 
    id: 2,
    name: "Candice Wu", 
    city: "Makkah", 
    contact: "Mr. Iftikhar", 
    email: "mail@gmail.com", 
    phone: "+1 8639724863",
    address: "New York",
    totalVehicles: "SR",
    totalGroups: "Ticket"
  },
  { 
    id: 3,
    name: "Candice Wu", 
    city: "Medinah", 
    contact: "Mr. Ahmed", 
    email: "abc@gmail.com", 
    phone: "+1 8639724863",
    address: "California",
    totalVehicles: "SR",
    totalGroups: "Visa"
  },
  { 
    id: 4,
    name: "Candice Wu", 
    city: "Islamabad", 
    contact: "Mr. Umair", 
    email: "mail@gmail.com", 
    phone: "+1 8639724863",
    address: "Texas",
    totalVehicles: "USD",
    totalGroups: "Transport"
  },
];

/* ================= MAIN COMPONENT ================= */

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      
      {/* Province Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {provinces.map((p, i) => (
          <ProvinceStatsCard key={i} {...p} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
        {/* New Sales Chart - Green */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-md">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">New Sales</h3>
            <p className="text-xs opacity-80">(+15%) increase in today sales</p>
          </div>
          <LineChart color="white" />
          <div className="flex justify-between text-[10px] mt-2 opacity-70">
            {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Completed Tasks Chart - Dark */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-5 text-white shadow-md">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Completed Tasks</h3>
            <p className="text-xs opacity-70">Last Campaign Performance</p>
          </div>
          <LineChart color="white" />
          <div className="flex justify-between text-[10px] mt-2 opacity-60">
            {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <p className="text-xs opacity-50 mt-3 flex items-center gap-1">
            <span className="w-3 h-3">⏱</span> just updated
          </p>
        </div>

        {/* Pending Tasks Chart - Pink */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 md:p-5 text-white shadow-md">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">Pending Tasks</h3>
            <p className="text-xs opacity-80">Last Campaign Performance</p>
          </div>
          <BarChart />
          <p className="text-xs opacity-70 mt-3 flex items-center gap-1">
            <span className="w-3 h-3">⏱</span> campaign sent 2 days ago
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                <FaFilter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                <FaDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden md:block">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email-id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Vehicles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Groups</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm mr-3">
                        CW
                      </div>
                      <div className="font-medium text-gray-900">{row.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{row.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded border border-blue-100">
                      {row.totalVehicles}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1.5 text-sm font-medium bg-green-50 text-green-700 rounded border border-green-100">
                      {row.totalGroups}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button className="text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-50 rounded">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Table Cards (shown on mobile) */}
        <div className="md:hidden p-4">
          {tableData.map((row) => (
            <MobileTableCard key={row.id} row={row} />
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <Pagination />
        </div>
      </div>
    </div>
  );
}