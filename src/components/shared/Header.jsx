"use client"

import { useClientContext } from '@/context/clientContext';
import { headerButtons } from '@/data/headerButtons';
import React, { useState } from 'react'
import HeaderButton from './HeaderButton';
import NotificationIcon from './NotificationIcon';

const Header = () => {
    const [activePage, setActivePage] = useState("clients");
    const [hasNotifications, setHasNotifications] = useState(true);

    const { showAddClient } = useClientContext();

    const handleButtonClick = (pageKey) => {
        setActivePage(pageKey);
    };

    const handleNotificationClick = () => {
        setHasNotifications(false);
    };

    return (
        <div className='flex flex-col gap-2'>
            <div className="flex justify-between items-center gap-2 sm:gap-4">
                {/* Buttons - Left side with flexible width */}
                <nav className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto pb-2 scrollbar-hide">
                    {headerButtons.map((button) => (
                        <HeaderButton
                            key={button.id}
                            title={button.title}
                            icon={button.icon}
                            active={activePage === button.pageKey}
                            onClick={() => handleButtonClick(button.pageKey)}
                        />
                    ))}
                </nav>

                {/* Right side - Notification (fixed width) */}
                <div className="flex items-center flex-shrink-0">
                    <button
                        onClick={handleNotificationClick}
                        className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors relative"
                        aria-label="Notifications"
                    >
                        <NotificationIcon hasNotification={hasNotifications} />
                    </button>
                </div>
            </div>

            {/* Full-width bar under buttons */}
            <div className="w-full h-2 rounded-full bg-customBlue my-2"></div>
        </div>
    )
}

export default Header