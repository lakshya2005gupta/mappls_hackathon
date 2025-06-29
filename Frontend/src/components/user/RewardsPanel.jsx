import React from 'react';
import { TrophyIcon, StarIcon, GiftIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';

const RewardsPanel = ({ user }) => {
  const { points, level, badges, achievements } = user;
  
  // Calculate progress to next level
  const nextLevelPoints = (level + 1) * 100;
  const progress = (points / nextLevelPoints) * 100;
  
  return (
    <div className="space-y-6">
      {/* Points and Level */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Rewards</h3>
          <div className="flex items-center">
            <GiftIcon className="h-5 w-5 text-primary-500 mr-1" />
            <span className="font-bold text-primary-600">{points} points</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Level {level}</span>
            <span className="text-sm text-gray-500">Level {level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {nextLevelPoints - points} points needed for next level
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{badges.length}</div>
            <div className="text-sm text-gray-500">Badges Earned</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{achievements.length}</div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">View Reward History</Button>
      </Card>
      
      {/* Badges */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Badges</h3>
          {badges.length > 0 && (
            <Button variant="outline" size="sm">View All</Button>
          )}
        </div>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {badges.slice(0, 8).map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  <TrophyIcon className="h-8 w-8 text-primary-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">{badge.name}</span>
                <span className="text-xs text-gray-500">{badge.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-medium text-gray-900 mb-1">No badges yet</h4>
            <p className="text-sm text-gray-500 mb-4">
              Participate in events to earn badges and rewards!
            </p>
            <Button variant="primary">Explore Events</Button>
          </div>
        )}
      </Card>
      
      {/* Achievements */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
          {achievements.length > 0 && (
            <Button variant="outline" size="sm">View All</Button>
          )}
        </div>
        
        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                    <StarIcon className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-primary-600 font-medium">+{achievement.points} points</span>
                    <span className="text-xs text-gray-500 ml-2">Earned on {achievement.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-medium text-gray-900 mb-1">No achievements yet</h4>
            <p className="text-sm text-gray-500 mb-4">
              Complete challenges to unlock achievements!
            </p>
            <Button variant="primary">View Challenges</Button>
          </div>
        )}
      </Card>
      
      {/* Available Rewards */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Free Event T-shirt</h4>
              <span className="text-primary-600 font-bold">500 points</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Get a free NGO Events t-shirt for your participation.
            </p>
            <Button 
              variant={points >= 500 ? "primary" : "outline"} 
              disabled={points < 500}
              className="w-full"
            >
              {points >= 500 ? "Redeem Reward" : `Need ${500 - points} more points`}
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Event VIP Access</h4>
              <span className="text-primary-600 font-bold">1000 points</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Get VIP access to premium events for one month.
            </p>
            <Button 
              variant={points >= 1000 ? "primary" : "outline"} 
              disabled={points < 1000}
              className="w-full"
            >
              {points >= 1000 ? "Redeem Reward" : `Need ${1000 - points} more points`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RewardsPanel; 