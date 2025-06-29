import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  MapIcon,
  CalendarIcon,
  UserIcon,
  GiftIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! I'm your NGO Event Assistant. How can I help you today?", 
      sender: 'bot',
      options: [
        { id: 'events', text: 'Find events', icon: <CalendarIcon className="h-4 w-4" /> },
        { id: 'donate', text: 'Donate food', icon: <GiftIcon className="h-4 w-4" /> },
        { id: 'traffic', text: 'Traffic routes', icon: <TruckIcon className="h-4 w-4" /> },
        { id: 'map', text: 'View map', icon: <MapIcon className="h-4 w-4" /> },
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show greeting message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      setTimeout(() => {
        const greeting = currentUser 
          ? `Welcome back, ${currentUser.name || 'there'}! How can I assist you today?` 
          : "Welcome to NGO Event App! How can I help you today?";
        
        addBotMessage(greeting);
      }, 500);
    }
  }, [isOpen, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Process user message and generate response
    setTimeout(() => {
      processUserMessage(inputValue);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (optionId) => {
    switch (optionId) {
      case 'events':
        addUserMessage('I want to find events');
        addBotMessage(
          'You can browse all our NGO events on the Events page. Would you like to go there now?',
          [
            { id: 'go-events', text: 'Go to Events', icon: <CalendarIcon className="h-4 w-4" /> },
            { id: 'event-categories', text: 'Event Categories', icon: <CalendarIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'donate':
        addUserMessage('I want to donate food');
        addBotMessage(
          'You can donate extra food to NGOs through our Food Donation page. Would you like to go there?',
          [
            { id: 'go-donate', text: 'Go to Food Donation', icon: <GiftIcon className="h-4 w-4" /> },
            { id: 'how-donate', text: 'How does it work?', icon: <GiftIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'traffic':
        addUserMessage('I need traffic route information');
        addBotMessage(
          'Our Traffic Route Management page helps you find the best routes to events and avoid congestion. Would you like to check it out?',
          [
            { id: 'go-traffic', text: 'Go to Traffic Routes', icon: <TruckIcon className="h-4 w-4" /> },
            { id: 'traffic-help', text: 'How does it work?', icon: <TruckIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'map':
        addUserMessage('I want to view the map');
        addBotMessage(
          'Our interactive map shows all event locations and nearby facilities. Would you like to see it?',
          [
            { id: 'go-map', text: 'Go to Map', icon: <MapIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'go-events':
        navigate('/events');
        addBotMessage('Taking you to the Events page...');
        break;
      case 'go-donate':
        navigate('/food-donation');
        addBotMessage('Taking you to the Food Donation page...');
        break;
      case 'go-traffic':
        navigate('/TrafficCongestion');
        addBotMessage('Taking you to the Traffic Route Management page...');
        break;
      case 'go-map':
        navigate('/map');
        addBotMessage('Taking you to the Map page...');
        break;
      case 'event-categories':
        addBotMessage(
          'We have various event categories including Education, Health, Environment, Community, Arts, Sports, Technology, Food, and Charity. Which category interests you?',
          [
            { id: 'cat-education', text: 'Education' },
            { id: 'cat-health', text: 'Health' },
            { id: 'cat-environment', text: 'Environment' },
            { id: 'cat-community', text: 'Community' }
          ]
        );
        break;
      case 'how-donate':
        addBotMessage(
          'Our food donation process is simple: 1) Browse active food drives 2) Select a drive to donate to 3) Fill out the donation form with details about your food 4) Submit and wait for the NGO to contact you for pickup. Would you like to donate now?',
          [
            { id: 'go-donate', text: 'Donate Now', icon: <GiftIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'traffic-help':
        addBotMessage(
          'Our Traffic Route Management system helps you: 1) Find the best route to your destination 2) Get notifications about events that might cause traffic 3) Receive alternative route suggestions to avoid congestion. Would you like to try it?',
          [
            { id: 'go-traffic', text: 'Try it Now', icon: <TruckIcon className="h-4 w-4" /> }
          ]
        );
        break;
      case 'login-help':
        if (!isAuthenticated) {
          navigate('/login');
          addBotMessage('Taking you to the login page...');
        } else {
          addBotMessage('You\'re already logged in!');
        }
        break;
      case 'register-help':
        if (!isAuthenticated) {
          navigate('/register');
          addBotMessage('Taking you to the registration page...');
        } else {
          addBotMessage('You\'re already registered and logged in!');
        }
        break;
      default:
        addBotMessage('I\'m not sure how to help with that. Can you try another option?');
    }
  };

  const addUserMessage = (text) => {
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
  };

  const addBotMessage = (text, options = null) => {
    const botMessage = { 
      id: Date.now(), 
      text, 
      sender: 'bot',
      options
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for keywords and respond accordingly
    if (lowerMessage.includes('event') || lowerMessage.includes('events')) {
      addBotMessage(
        'We have many NGO events available. Would you like to browse all events or search for specific ones?',
        [
          { id: 'go-events', text: 'Browse Events', icon: <CalendarIcon className="h-4 w-4" /> },
          { id: 'event-categories', text: 'Event Categories', icon: <CalendarIcon className="h-4 w-4" /> }
        ]
      );
    } else if (lowerMessage.includes('donate') || lowerMessage.includes('food') || lowerMessage.includes('donation')) {
      addBotMessage(
        'You can donate food through our Food Donation page. Would you like to learn more or go there now?',
        [
          { id: 'go-donate', text: 'Go to Donation Page', icon: <GiftIcon className="h-4 w-4" /> },
          { id: 'how-donate', text: 'How does it work?', icon: <GiftIcon className="h-4 w-4" /> }
        ]
      );
    } else if (lowerMessage.includes('traffic') || lowerMessage.includes('route') || lowerMessage.includes('congestion')) {
      addBotMessage(
        'Our Traffic Route Management helps you find the best routes to events. Would you like to check it out?',
        [
          { id: 'go-traffic', text: 'Go to Traffic Routes', icon: <TruckIcon className="h-4 w-4" /> },
          { id: 'traffic-help', text: 'How does it work?', icon: <TruckIcon className="h-4 w-4" /> }
        ]
      );
    } else if (lowerMessage.includes('map') || lowerMessage.includes('location')) {
      addBotMessage(
        'You can view all event locations on our interactive map. Would you like to see it?',
        [
          { id: 'go-map', text: 'View Map', icon: <MapIcon className="h-4 w-4" /> }
        ]
      );
    } else if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
      if (!isAuthenticated) {
        addBotMessage(
          'You need to login to access all features. Would you like to login now?',
          [
            { id: 'login-help', text: 'Go to Login', icon: <UserIcon className="h-4 w-4" /> }
          ]
        );
      } else {
        addBotMessage('You\'re already logged in!');
      }
    } else if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
      if (!isAuthenticated) {
        addBotMessage(
          'Creating an account gives you access to all features. Would you like to register now?',
          [
            { id: 'register-help', text: 'Go to Registration', icon: <UserIcon className="h-4 w-4" /> }
          ]
        );
      } else {
        addBotMessage('You\'re already registered and logged in!');
      }
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greeting = currentUser 
        ? `Hello ${currentUser.name || 'there'}! How can I assist you today?` 
        : "Hello! How can I help you today?";
      
      addBotMessage(greeting, [
        { id: 'events', text: 'Find events', icon: <CalendarIcon className="h-4 w-4" /> },
        { id: 'donate', text: 'Donate food', icon: <GiftIcon className="h-4 w-4" /> },
        { id: 'traffic', text: 'Traffic routes', icon: <TruckIcon className="h-4 w-4" /> },
        { id: 'map', text: 'View map', icon: <MapIcon className="h-4 w-4" /> },
      ]);
    } else if (lowerMessage.includes('thank')) {
      addBotMessage("You're welcome! Is there anything else I can help you with?", [
        { id: 'events', text: 'Find events', icon: <CalendarIcon className="h-4 w-4" /> },
        { id: 'donate', text: 'Donate food', icon: <GiftIcon className="h-4 w-4" /> },
        { id: 'traffic', text: 'Traffic routes', icon: <TruckIcon className="h-4 w-4" /> },
        { id: 'map', text: 'View map', icon: <MapIcon className="h-4 w-4" /> },
      ]);
    } else if (lowerMessage.includes('help')) {
      addBotMessage(
        "I can help you with finding events, donating food, checking traffic routes, or viewing the map. What would you like to do?",
        [
          { id: 'events', text: 'Find events', icon: <CalendarIcon className="h-4 w-4" /> },
          { id: 'donate', text: 'Donate food', icon: <GiftIcon className="h-4 w-4" /> },
          { id: 'traffic', text: 'Traffic routes', icon: <TruckIcon className="h-4 w-4" /> },
          { id: 'map', text: 'View map', icon: <MapIcon className="h-4 w-4" /> },
        ]
      );
    } else {
      addBotMessage(
        "I'm not sure I understand. Can you try asking about events, food donation, traffic routes, or the map?",
        [
          { id: 'events', text: 'Find events', icon: <CalendarIcon className="h-4 w-4" /> },
          { id: 'donate', text: 'Donate food', icon: <GiftIcon className="h-4 w-4" /> },
          { id: 'traffic', text: 'Traffic routes', icon: <TruckIcon className="h-4 w-4" /> },
          { id: 'map', text: 'View map', icon: <MapIcon className="h-4 w-4" /> },
        ]
      );
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 z-50"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      <div 
        className={`fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform z-50 dark:bg-dark-100 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Chat header */}
        <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
            <h3 className="font-medium">NGO Event Assistant</h3>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white hover:text-gray-200"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 130px)' }}>
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:bg-opacity-50 dark:text-primary-100' 
                    : 'bg-gray-100 text-gray-800 dark:bg-dark-200 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              
              {/* Quick reply options */}
              {message.options && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 flex items-center hover:bg-gray-100 transition-colors dark:bg-dark-200 dark:border-dark-300 dark:text-gray-300 dark:hover:bg-dark-300"
                    >
                      {option.icon && <span className="mr-1">{option.icon}</span>}
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="mb-4">
              <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 dark:bg-dark-200 dark:text-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce dark:bg-gray-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce dark:bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce dark:bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-dark-300">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-200 dark:border-dark-300 dark:text-white"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 transition-colors"
              disabled={inputValue.trim() === ''}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot; 