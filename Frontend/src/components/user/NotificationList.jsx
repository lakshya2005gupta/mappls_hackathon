import React from 'react';
import { 
  BellIcon, 
  CalendarIcon, 
  MapPinIcon, 
  TrophyIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';

const NotificationList = ({ notifications = [], onMarkAsRead, onClearAll }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
        <p className="text-gray-500">
          You're all caught up! Check back later for new notifications.
        </p>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return <CalendarIcon className="h-6 w-6 text-primary-500" />;
      case 'location':
        return <MapPinIcon className="h-6 w-6 text-blue-500" />;
      case 'reward':
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'event':
        return <Badge variant="primary" size="sm">Event</Badge>;
      case 'location':
        return <Badge variant="info" size="sm">Nearby</Badge>;
      case 'reward':
        return <Badge variant="warning" size="sm">Reward</Badge>;
      default:
        return <Badge variant="default" size="sm">Info</Badge>;
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([date, items]) => (
          <div key={date}>
            <div className="text-sm font-medium text-gray-500 mb-2">{date}</div>
            <div className="space-y-3">
              {items.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`bg-white rounded-lg border ${
                    notification.read ? 'border-gray-200' : 'border-primary-200 bg-primary-50'
                  } p-4 shadow-sm`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {getNotificationBadge(notification.type)}
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(notification.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 mt-1">{notification.title}</h4>
                        </div>
                        {!notification.read && (
                          <button 
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      {notification.actionUrl && (
                        <a 
                          href={notification.actionUrl}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                        >
                          {notification.actionText || 'View Details'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList; 