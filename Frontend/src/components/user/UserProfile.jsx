import React from 'react';
import { 
  UserIcon, 
  TrophyIcon, 
  CalendarIcon, 
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const UserProfile = ({ user }) => {
  const {
    name,
    email,
    avatar,
    location,
    joinedDate,
    points,
    level,
    badges,
    eventsAttended,
    upcomingEvents,
  } = user;

  // Format date
  const formattedJoinedDate = new Date(joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate progress to next level
  const nextLevelPoints = (level + 1) * 100;
  const progress = (points / nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="p-0">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                  <UserIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">
                Lv{level}
              </div>
            </div>
            <h2 className="text-xl font-bold mt-4 text-gray-900">{name}</h2>
            <p className="text-gray-500 mb-2">{email}</p>
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Joined {formattedJoinedDate}</span>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Reward Points</h3>
                <span className="text-primary-600 font-bold">{points} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Level {level}</span>
                <span>{nextLevelPoints - points} points to Level {level + 1}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-1">
                      <TrophyIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="text-xs text-gray-700">{badge}</span>
                  </div>
                ))}
                {badges.length === 0 && (
                  <p className="text-sm text-gray-500">No badges earned yet. Participate in events to earn badges!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-primary-600 mb-1">{eventsAttended.length}</div>
          <div className="text-gray-500">Events Attended</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-primary-600 mb-1">{upcomingEvents.length}</div>
          <div className="text-gray-500">Upcoming Events</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-primary-600 mb-1">{level}</div>
          <div className="text-gray-500">Current Level</div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {eventsAttended.length > 0 ? (
          <div className="space-y-4">
            {eventsAttended.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <CalendarIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge variant="success" size="sm">+{event.pointsEarned} pts</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < event.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Your rating</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't attended any events yet.</p>
        )}
      </Card>
    </div>
  );
};

export default UserProfile; 