import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import { mockEvents } from '../../utils/mockData';

const EventFilters = ({ 
  filters, 
  setFilters, 
  categories,
  onApplyFilters,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Extract unique locations from mock events for suggestions
  const uniqueLocations = [...new Set(mockEvents.map(event => event.location))];
  
  // Extract unique event titles and organizers for search suggestions
  const searchTerms = [...new Set([
    ...mockEvents.map(event => event.title),
    ...mockEvents.map(event => event.organizer),
    ...mockEvents.map(event => event.category)
  ])];

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
    
    // Generate suggestions based on input
    if (name === 'search' && value.length > 0) {
      const filtered = searchTerms.filter(term => 
        term.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
      setShowSearchSuggestions(true);
    } else if (name === 'search') {
      setShowSearchSuggestions(false);
    }
    
    if (name === 'location' && value.length > 0) {
      const filtered = uniqueLocations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
      setShowLocationSuggestions(true);
    } else if (name === 'location') {
      setShowLocationSuggestions(false);
    }
  };

  const handleSuggestionClick = (name, value) => {
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
    if (name === 'search') {
      setShowSearchSuggestions(false);
    } else if (name === 'location') {
      setShowLocationSuggestions(false);
    }
  };

  const handleCategoryChange = (category) => {
    if (localFilters.categories.includes(category)) {
      setLocalFilters({
        ...localFilters,
        categories: localFilters.categories.filter(c => c !== category),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        categories: [...localFilters.categories, category],
      });
    }
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    }
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      categories: [],
      date: '',
      location: '',
      sortBy: 'date',
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    if (onApplyFilters) {
      onApplyFilters(resetFilters);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchSuggestions(false);
      setShowLocationSuggestions(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Events</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center"
        >
          <FunnelIcon className="h-4 w-4 mr-1" />
          Filters
        </Button>
      </div>

      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 dark:bg-dark-200 dark:border-dark-100 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Filter Events</h3>
            <button 
              onClick={toggleFilters}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white transition-colors duration-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={localFilters.search}
                onChange={handleFilterChange}
                placeholder="Search events..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-100 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                onClick={(e) => e.stopPropagation()}
              />
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-dark-100 border border-gray-200 dark:border-dark-300">
                  <ul className="max-h-60 overflow-auto py-1">
                    {searchSuggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-900 dark:text-gray-200"
                        onClick={() => handleSuggestionClick('search', suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                      localFilters.categories.includes(category)
                        ? 'bg-primary-100 text-primary-800 border-primary-200 border dark:bg-primary-900 dark:bg-opacity-60 dark:text-primary-300 dark:border-primary-700'
                        : 'bg-gray-100 text-gray-800 border-gray-200 border hover:bg-gray-200 dark:bg-dark-300 dark:text-gray-200 dark:border-dark-400 dark:hover:bg-dark-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={localFilters.date}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-100 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={localFilters.location}
                onChange={handleFilterChange}
                placeholder="Enter location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-100 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                onClick={(e) => e.stopPropagation()}
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-dark-100 border border-gray-200 dark:border-dark-300">
                  <ul className="max-h-60 overflow-auto py-1">
                    {locationSuggestions.map((location, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-900 dark:text-gray-200"
                        onClick={() => handleSuggestionClick('location', location)}
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={localFilters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-100 dark:border-gray-600 dark:text-white"
              >
                <option value="date">Date (Newest First)</option>
                <option value="dateAsc">Date (Oldest First)</option>
                <option value="name">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters; 