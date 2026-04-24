"use client";

import React from 'react'
import { Sun, RotateCcw, Bell, Settings, Menu, Search } from "lucide-react";
// import { useSidebar } from '@/context/SidebarContext'; 

const Navbar = () => {
  const iconClasses = "w-5 h-5 cursor-pointer text-gray-600 hover:text-customBlue transition-colors";
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  return (
    <div className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
        {/* Mobile Menu Toggle Button - Only show on mobile */}
        {isMobile && (
          <button 
            className="p-2 -ml-1"
            // onClick={toggleSidebar} // Agar sidebar context hai
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Icons */}
        <div className={`flex items-center gap-2 ${isMobile ? 'hidden sm:flex' : ''}`}>
          <Settings className={iconClasses} />
        </div>
        
        {/* Title */}
        <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium max-w-[120px] sm:max-w-[200px] md:max-w-none text-nowrap">
          Organization Setup
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
        {/* Mobile Search Toggle Button */}
        {isMobile && !showMobileSearch && (
          <button 
            className="p-2"
            onClick={() => setShowMobileSearch(true)}
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Search Bar - Mobile expanded view */}
        {isMobile && showMobileSearch ? (
          <div className="absolute left-0 right-0 top-0 h-14 bg-white border-b border-gray-200 flex items-center px-3 z-10">
            <div className="flex items-center w-full">
              <button 
                className="p-2 mr-2"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Close search"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg outline-none text-gray-800 text-sm placeholder:text-gray-500"
                  placeholder="Search..." 
                  autoFocus
                />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Search Bar */
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="pl-10 pr-3 py-2 bg-gray-100 rounded-xl outline-none text-gray-800 text-sm w-48 lg:w-64 placeholder:text-gray-500" 
              placeholder="Search..." 
            />
          </div>
        )}

        {/* Icons - Mobile: less icons, Desktop: all icons */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Mobile: Only essential icons */}
          {isMobile ? (
            <>
              <Bell className={iconClasses} />
              <Settings className={iconClasses} />
            </>
          ) : (
            <>
              <Sun className={iconClasses} />
              <RotateCcw className={iconClasses} />
              <Bell className={iconClasses} />
              <Settings className={iconClasses} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;