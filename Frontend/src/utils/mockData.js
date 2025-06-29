// Mock data for development purposes

// Event Categories
export const eventCategories = [
  'Cleaning Drive',
  'Awareness',
  'Education',
  'Health',
  'Sports',
  'Other',
];

// Mock Events
export const mockEvents = [
  {
    id: 1,
    title: 'Beach Cleanup Drive',
    description: 'Join us for a community beach cleanup event. Help us keep our beaches clean and safe for everyone. Bring your friends and family!',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-07-15',
    time: '09:00 AM',
    location: 'Marina Beach, Chennai',
    organizer: 'Clean Earth Foundation',
    category: 'Cleaning Drive',
    attendees: 45,
    points: 100,
    latitude: 13.0827, // Chennai Marina Beach coordinates
    longitude: 80.2707,
  },
  {
    id: 2,
    title: 'Environmental Awareness Workshop',
    description: 'Learn about environmental conservation and sustainable practices in this interactive workshop. Experts will share insights on how to reduce your carbon footprint.',
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-07-22',
    time: '02:00 PM',
    location: 'Community Center, Bangalore',
    organizer: 'Green Earth Initiative',
    category: 'Awareness',
    attendees: 30,
    points: 75,
    latitude: 12.9716, // Bangalore coordinates
    longitude: 77.5946,
  },
  {
    id: 3,
    title: 'Free Health Checkup Camp',
    description: 'Get a comprehensive health checkup for free. Services include blood pressure monitoring, blood sugar testing, and general health consultation.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-07-29',
    time: '10:00 AM',
    location: 'Public Park, Mumbai',
    organizer: 'Health For All',
    category: 'Health',
    attendees: 120,
    points: 150,
    latitude: 19.0760, // Mumbai coordinates
    longitude: 72.8777,
  },
  {
    id: 4,
    title: 'Children\'s Education Drive',
    description: 'Help underprivileged children with their education. We\'ll be distributing books, stationery, and conducting fun learning activities.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-08-05',
    time: '11:00 AM',
    location: 'Community School, Delhi',
    organizer: 'Education For All',
    category: 'Education',
    attendees: 25,
    points: 100,
    latitude: 28.7041, // Delhi coordinates
    longitude: 77.1025,
  },
  {
    id: 5,
    title: 'Community Sports Day',
    description: 'A day of sports and fun activities for the whole community. Participate in various games and competitions with exciting prizes to be won!',
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-08-12',
    time: '08:00 AM',
    location: 'Sports Complex, Hyderabad',
    organizer: 'Sports For Youth',
    category: 'Sports',
    attendees: 80,
    points: 120,
    latitude: 17.3850, // Hyderabad coordinates
    longitude: 78.4867,
  },
  {
    id: 6,
    title: 'River Cleanup Initiative',
    description: 'Help us clean up the river and its banks. This initiative aims to restore the natural beauty of our water bodies and prevent pollution.',
    image: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    date: '2023-08-19',
    time: '07:30 AM',
    location: 'Riverside Park, Kolkata',
    organizer: 'Clean Rivers Project',
    category: 'Cleaning Drive',
    attendees: 35,
    points: 100,
    latitude: 22.5726, // Kolkata coordinates
    longitude: 88.3639,
  },
];

// Mock User
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  location: 'Mumbai, India',
  joinedDate: '2023-01-15',
  points: 450,
  level: 4,
  badges: [
    { name: 'First Event', date: '2023-01-20' },
    { name: 'Cleanup Hero', date: '2023-02-15' },
    { name: 'Regular Volunteer', date: '2023-03-10' },
    { name: 'Community Champion', date: '2023-05-22' },
  ],
  achievements: [
    { 
      name: 'Cleanup Enthusiast', 
      description: 'Participated in 3 cleanup drives', 
      points: 50,
      date: '2023-03-15'
    },
    { 
      name: 'Health Advocate', 
      description: 'Attended 2 health awareness events', 
      points: 30,
      date: '2023-04-20'
    },
    { 
      name: 'Education Supporter', 
      description: 'Contributed to education initiatives', 
      points: 75,
      date: '2023-06-10'
    },
  ],
  eventsAttended: [
    {
      id: 1,
      title: 'Beach Cleanup Drive',
      date: '2023-02-15',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      pointsEarned: 100,
      rating: 5,
    },
    {
      id: 3,
      title: 'Free Health Checkup Camp',
      date: '2023-04-10',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      pointsEarned: 150,
      rating: 4,
    },
    {
      id: 4,
      title: 'Children\'s Education Drive',
      date: '2023-05-20',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      pointsEarned: 100,
      rating: 5,
    },
  ],
  upcomingEvents: [
    {
      id: 5,
      title: 'Community Sports Day',
      date: '2023-08-12',
      image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 6,
      title: 'River Cleanup Initiative',
      date: '2023-08-19',
      image: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ],
};

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    type: 'event',
    title: 'New Event Near You',
    message: 'Beach Cleanup Drive is happening near your location this weekend.',
    timestamp: '2023-07-12T10:30:00',
    read: false,
    actionUrl: '/events/1',
    actionText: 'View Event',
  },
  {
    id: 2,
    type: 'reward',
    title: 'Points Earned',
    message: 'You earned 100 points for attending the Beach Cleanup Drive.',
    timestamp: '2023-07-10T15:45:00',
    read: true,
    actionUrl: '/rewards',
    actionText: 'View Rewards',
  },
  {
    id: 3,
    type: 'location',
    title: 'Events Nearby',
    message: 'There are 3 events happening within 5km of your location this month.',
    timestamp: '2023-07-08T09:15:00',
    read: false,
    actionUrl: '/map',
    actionText: 'View Map',
  },
  {
    id: 4,
    type: 'event',
    title: 'Event Reminder',
    message: 'Don\'t forget about the Environmental Awareness Workshop tomorrow!',
    timestamp: '2023-07-05T18:20:00',
    read: true,
    actionUrl: '/events/2',
    actionText: 'View Details',
  },
  {
    id: 5,
    type: 'reward',
    title: 'New Badge Earned',
    message: 'Congratulations! You\'ve earned the "Regular Volunteer" badge.',
    timestamp: '2023-07-01T14:10:00',
    read: true,
    actionUrl: '/profile',
    actionText: 'View Profile',
  },
];

// Mock Organization
export const mockOrganization = {
  id: 1,
  name: 'Green Earth Initiative',
  description: 'Working towards a cleaner and greener planet through community engagement and awareness.',
  logo: 'https://via.placeholder.com/150',
  website: 'https://example.com',
  email: 'contact@greenearth.org',
  phone: '+91 9876543210',
  address: '123 Green Street, Eco City, India',
};

// Mock Users for Admin
export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'Mumbai, India',
    eventsAttended: [{ id: 1 }, { id: 3 }, { id: 4 }],
    points: 450,
    level: 4,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Delhi, India',
    eventsAttended: [{ id: 1 }, { id: 2 }],
    points: 275,
    level: 3,
  },
  {
    id: 3,
    name: 'Raj Kumar',
    email: 'raj.kumar@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    location: 'Bangalore, India',
    eventsAttended: [{ id: 3 }, { id: 5 }],
    points: 320,
    level: 3,
  },
  {
    id: 4,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    location: 'Chennai, India',
    eventsAttended: [{ id: 1 }, { id: 4 }, { id: 6 }],
    points: 500,
    level: 5,
  },
  {
    id: 5,
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    location: 'Hyderabad, India',
    eventsAttended: [{ id: 2 }, { id: 5 }],
    points: 200,
    level: 2,
  },
]; 