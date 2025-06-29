import React, { useState, useEffect } from 'react';
import EventList from '../components/events/EventList';
import EventFilters from '../components/events/EventFilters';
import { mockEvents, eventCategories } from '../utils/mockData';
import { useTheme } from '../context/ThemeContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    date: '',
    location: '',
    sortBy: 'date',
  });
  const { darkMode } = useTheme();

  useEffect(() => {
    // Simulate API call
    const fetchEvents = () => {
      setLoading(true);
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 800);
    };

    fetchEvents();
  }, []);

  const applyFilters = (events, filters) => {
    let filteredEvents = [...events];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm) ||
          event.organizer.toLowerCase().includes(searchTerm) ||
          event.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        filters.categories.includes(event.category)
      );
    }

    // Filter by date
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === filterDate.getFullYear() &&
          eventDate.getMonth() === filterDate.getMonth() &&
          eventDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Filter by location
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(locationTerm)
      );
    }

    // Sort events
    switch (filters.sortBy) {
      case 'date':
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'dateAsc':
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'name':
        filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'nameDesc':
        filteredEvents.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popular':
        filteredEvents.sort((a, b) => b.attendees - a.attendees);
        break;
      default:
        filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filteredEvents;
  };

  const filteredEvents = applyFilters(events, filters);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      <div className="md:flex md:gap-8">
        <div className="md:w-1/4 mb-6 md:mb-0">
          <EventFilters
            filters={filters}
            setFilters={setFilters}
            categories={eventCategories}
            onApplyFilters={handleApplyFilters}
            className="animate-fade-in"
          />
        </div>
        <div className="md:w-3/4">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Events</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover and join events organized by NGOs and community groups.
            </p>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-dark-300 p-4 rounded-lg h-32"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600 dark:text-gray-300 animate-fade-in">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </div>
              <div className="space-y-4 animate-fade-in">
                <EventList events={filteredEvents} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 