import React, { useState, useEffect } from 'react';
import { MapPin, Search, Plus, Menu, X, Filter, Star, Clock, DollarSign, Wifi, WifiOff } from 'lucide-react';
import ReportModal from './components/ReportModal';
import InstallPrompt from './components/InstallPrompt';
import { useOfflineStorage } from './hooks/useOfflineStorage';

interface Location {
  id: string;
  name: string;
  type: 'candy' | 'ice_cream';
  lat: number;
  lng: number;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  hours: string;
  isOpen: boolean;
  description: string;
  reportedBy: string;
  timestamp: Date;
  synced?: boolean;
}

const initialLocations: Location[] = [
  {
    id: '1',
    name: 'Sonic Drive-In',
    type: 'ice_cream',
    lat: 40.7589,
    lng: -73.9851,
    rating: 4.2,
    priceRange: '$',
    hours: '6AM - 12AM',
    isOpen: true,
    description: 'Famous for slushies, ice cream, and frozen treats',
    reportedBy: 'FrozenFan',
    timestamp: new Date('2024-01-15T10:30:00'),
    synced: true
  },
  {
    id: '2',
    name: 'Sweet Dreams Candy Shop',
    type: 'candy',
    lat: 40.7505,
    lng: -73.9934,
    rating: 4.8,
    priceRange: '$$',
    hours: '10AM - 9PM',
    isOpen: true,
    description: 'Artisanal chocolates and vintage candies',
    reportedBy: 'CandyLover',
    timestamp: new Date('2024-01-14T15:45:00'),
    synced: true
  },
  {
    id: '3',
    name: 'Dairy Queen',
    type: 'ice_cream',
    lat: 40.7614,
    lng: -73.9776,
    rating: 4.0,
    priceRange: '$',
    hours: '10AM - 11PM',
    isOpen: true,
    description: 'Blizzards, soft serve, and ice cream cakes',
    reportedBy: 'IceCreamKing',
    timestamp: new Date('2024-01-13T12:20:00'),
    synced: true
  },
  {
    id: '4',
    name: 'Bubble Tea Paradise',
    type: 'ice_cream',
    lat: 40.7549,
    lng: -73.9840,
    rating: 4.5,
    priceRange: '$$',
    hours: '11AM - 10PM',
    isOpen: false,
    description: 'Boba tea, smoothies, and frozen drinks',
    reportedBy: 'BubbleFan',
    timestamp: new Date('2024-01-12T16:10:00'),
    synced: true
  }
];

function App() {
  const { 
    isOnline, 
    offlineQueue, 
    saveToLocalStorage, 
    loadFromLocalStorage, 
    addToOfflineQueue 
  } = useOfflineStorage();
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [filter, setFilter] = useState<'all' | 'candy' | 'ice_cream'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedLocations = loadFromLocalStorage();
    if (savedLocations.length > 0) {
      setLocations(savedLocations);
    } else {
      setLocations(initialLocations);
      saveToLocalStorage(initialLocations);
    }
  }, []);

  // Handle URL parameters for shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const actionParam = urlParams.get('action');

    if (filterParam && ['candy', 'ice_cream'].includes(filterParam)) {
      setFilter(filterParam as 'candy' | 'ice_cream');
    }

    if (actionParam === 'add') {
      setShowReportModal(true);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const filteredLocations = locations.filter(location => {
    const matchesFilter = filter === 'all' || location.type === filter;
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddLocation = (newLocation: Omit<Location, 'id' | 'timestamp' | 'synced'>) => {
    const location: Location = {
      ...newLocation,
      id: Date.now().toString(),
      timestamp: new Date(),
      synced: isOnline
    };
    
    const updatedLocations = [...locations, location];
    setLocations(updatedLocations);
    saveToLocalStorage(updatedLocations);
    
    // Add to offline queue if offline
    if (!isOnline) {
      addToOfflineQueue(location);
    }
    
    setShowReportModal(false);
  };

  const getTypeIcon = (type: string) => {
    return type === 'candy' ? '🍭' : '🍦';
  };

  const getTypeColor = (type: string) => {
    return type === 'candy' ? 'bg-pink-500' : 'bg-cyan-500';
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg relative z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors md:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-bold">Sweet Tracker</h1>
              
              {/* Online/Offline Indicator */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                isOnline ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Offline Queue Indicator */}
              {offlineQueue.length > 0 && (
                <div className="bg-yellow-500/20 px-2 py-1 rounded-full text-xs">
                  {offlineQueue.length} pending
                </div>
              )}
              
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search sweet spots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-2 flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors md:hidden"
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-2 flex space-x-2 md:hidden">
              {[
                { key: 'all', label: 'All', icon: '🍭🍦' },
                { key: 'candy', label: 'Candy', icon: '🍭' },
                { key: 'ice_cream', label: 'Ice Cream', icon: '🍦' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filter === key
                      ? 'bg-white text-pink-500 font-medium'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex px-4 pb-3 space-x-2">
          {[
            { key: 'all', label: 'All Locations', icon: '🍭🍦' },
            { key: 'candy', label: 'Candy Stores', icon: '🍭' },
            { key: 'ice_cream', label: 'Ice Cream', icon: '🍦' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                filter === key
                  ? 'bg-white text-pink-500 font-medium'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">Map integration would show locations here</p>
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                {filteredLocations.slice(0, 4).map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location);
                      setIsSidebarOpen(true);
                    }}
                    className={`${getTypeColor(location.type)} text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all relative`}
                  >
                    {!location.synced && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                    )}
                    <div className="text-2xl mb-1">{getTypeIcon(location.type)}</div>
                    <div className="text-xs font-medium truncate">{location.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          md:w-80 md:block
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                Sweet Spots ({filteredLocations.length})
              </h2>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Location List */}
            <div className="flex-1 overflow-y-auto">
              {filteredLocations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>No sweet spots found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md relative ${
                        selectedLocation?.id === location.id
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {!location.synced && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                      
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getTypeIcon(location.type)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{location.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="text-yellow-400 fill-current" size={12} />
                                <span className="text-xs text-gray-600">{location.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="text-green-500" size={12} />
                                <span className="text-xs text-gray-600">{location.priceRange}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          location.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {location.isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{location.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={10} />
                          <span>{location.hours}</span>
                        </div>
                        <span>by {location.reportedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleAddLocation}
        />
      )}

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default App;