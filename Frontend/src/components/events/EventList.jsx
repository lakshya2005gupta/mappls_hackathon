import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-dark-200 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-dark-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 dark:bg-dark-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-5/6 mb-4"></div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-dark-300 mr-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-1/2"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-dark-300 mr-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-1/3"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-dark-300 mr-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-dark-100">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 dark:bg-dark-300 rounded w-1/4"></div>
                <div className="h-8 bg-gray-300 dark:bg-dark-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-dark-200 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          There are no events matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <div key={event.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventList; 