import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon, GiftIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    description,
    image,
    date,
    time,
    location,
    organizer,
    category,
    attendees,
  } = event;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getCategoryColor = (category) => {
    const categoryMap = {
      'Education': 'blue',
      'Health': 'green',
      'Environment': 'emerald',
      'Community': 'purple',
      'Arts': 'pink',
      'Sports': 'orange',
      'Technology': 'indigo',
      'Food': 'yellow',
      'Charity': 'red'
    };
    
    return categoryMap[category] || 'primary';
  };
  
  const handleDonateFood = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/food-donation', { 
      state: { 
        fromEvent: true, 
        eventName: title,
        eventLocation: location
      } 
    });
  };

  return (
    <Card hover className="h-full flex flex-col hover-card transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={image || 'https://via.placeholder.com/400x200?text=Event+Image'}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={getCategoryColor(category)}>{category}</Badge>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CalendarIcon className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <ClockIcon className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPinIcon className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <UserGroupIcon className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" />
            <span>{attendees} attendees</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">By {organizer}</span>
          <Link to={`/events/${id}`}>
            <Button variant="primary" size="sm">View Details</Button>
          </Link>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDonateFood}
            className="flex items-center"
          >
            <GiftIcon className="h-4 w-4 mr-1" />
            Donate Food
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Helper function to determine badge variant based on category
const getCategoryVariant = (category) => {
  const variants = {
    'Cleaning Drive': 'primary',
    'Awareness': 'info',
    'Education': 'secondary',
    'Health': 'success',
    'Sports': 'warning',
    'Other': 'default',
    'Environment': 'success',
    'Community': 'primary',
    'Fundraising': 'secondary',
    'Animal Welfare': 'success',
    'Disaster Relief': 'danger',
    'Arts & Culture': 'info'
  };
  
  return variants[category] || 'default';
};

export default EventCard; 