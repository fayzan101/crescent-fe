import React from 'react';
import { Bell } from 'lucide-react';

const NotificationIcon = ({ hasNotification = false }) => (
  <div className="relative">
    <Bell 
      size={24} 
      strokeWidth={2} 
      className="text-gray-700 hover:text-customGreen transition-colors"
    />
    
    {/* Red dot for notifications */}
    {hasNotification && (
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
    )}
  </div>
);

export default NotificationIcon;