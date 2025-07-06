#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class SweetTrackerInstaller {
  constructor() {
    this.projectName = 'sweet-tracker';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(`${colors.cyan}${prompt}${colors.reset}`, resolve);
    });
  }

  async checkPrerequisites() {
    this.log('\n🔍 Checking prerequisites...', 'blue');
    
    try {
      // Check Node.js
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      this.log(`✅ Node.js found: ${nodeVersion}`, 'green');
      
      // Check npm
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`✅ npm found: ${npmVersion}`, 'green');
      
      return true;
    } catch (error) {
      this.log('❌ Prerequisites not met:', 'red');
      this.log('Please install Node.js (v16 or higher) from https://nodejs.org/', 'yellow');
      return false;
    }
  }

  async getProjectDetails() {
    this.log('\n📝 Project Configuration', 'magenta');
    
    const projectName = await this.question('Project name (sweet-tracker): ');
    this.projectName = projectName.trim() || 'sweet-tracker';
    
    const installPath = await this.question(`Installation directory (./${this.projectName}): `);
    this.installPath = path.resolve(installPath.trim() || `./${this.projectName}`);
    
    return true;
  }

  async createProject() {
    this.log('\n🚀 Creating project...', 'blue');
    
    try {
      // Create project directory
      if (!fs.existsSync(this.installPath)) {
        fs.mkdirSync(this.installPath, { recursive: true });
        this.log(`✅ Created directory: ${this.installPath}`, 'green');
      }
      
      // Change to project directory
      process.chdir(this.installPath);
      
      // Initialize Vite React TypeScript project
      this.log('📦 Initializing Vite React TypeScript project...', 'yellow');
      execSync('npm create vite@latest . -- --template react-ts --yes', { stdio: 'inherit' });
      
      return true;
    } catch (error) {
      this.log(`❌ Failed to create project: ${error.message}`, 'red');
      return false;
    }
  }

  async installDependencies() {
    this.log('\n📦 Installing dependencies...', 'blue');
    
    try {
      // Install base dependencies
      this.log('Installing React dependencies...', 'yellow');
      execSync('npm install', { stdio: 'inherit' });
      
      // Install additional dependencies
      this.log('Installing UI and utility libraries...', 'yellow');
      execSync('npm install lucide-react@latest tailwindcss@latest postcss@latest autoprefixer@latest', { stdio: 'inherit' });
      
      // Install dev dependencies
      this.log('Installing development dependencies...', 'yellow');
      execSync('npm install -D @types/node@latest', { stdio: 'inherit' });
      
      return true;
    } catch (error) {
      this.log(`❌ Failed to install dependencies: ${error.message}`, 'red');
      return false;
    }
  }

  async setupTailwind() {
    this.log('\n🎨 Setting up Tailwind CSS...', 'blue');
    
    try {
      // Initialize Tailwind
      execSync('npx tailwindcss init -p --yes', { stdio: 'inherit' });
      
      return true;
    } catch (error) {
      this.log(`❌ Failed to setup Tailwind: ${error.message}`, 'red');
      return false;
    }
  }

  createProjectFiles() {
    this.log('\n📄 Creating project files...', 'blue');
    
    const files = {
      'src/App.tsx': this.getAppContent(),
      'src/components/ReportModal.tsx': this.getReportModalContent(),
      'src/index.css': this.getIndexCssContent(),
      'tailwind.config.js': this.getTailwindConfigContent(),
      'README.md': this.getReadmeContent(),
      '.gitignore': this.getGitignoreContent()
    };
    
    try {
      // Create components directory
      const componentsDir = path.join(process.cwd(), 'src', 'components');
      if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
      }
      
      // Write all files
      Object.entries(files).forEach(([filePath, content]) => {
        const fullPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(fullPath, content, 'utf8');
        this.log(`✅ Created: ${filePath}`, 'green');
      });
      
      return true;
    } catch (error) {
      this.log(`❌ Failed to create files: ${error.message}`, 'red');
      return false;
    }
  }

  async runPostInstallSetup() {
    this.log('\n⚙️  Running post-install setup...', 'blue');
    
    try {
      // Build the project to ensure everything works
      this.log('Building project...', 'yellow');
      execSync('npm run build', { stdio: 'inherit' });
      
      this.log('✅ Build successful!', 'green');
      return true;
    } catch (error) {
      this.log(`⚠️  Build failed, but installation completed: ${error.message}`, 'yellow');
      return true; // Continue anyway
    }
  }

  async showCompletionMessage() {
    this.log('\n🎉 Installation Complete!', 'green');
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    this.log(`📁 Project created at: ${this.installPath}`, 'blue');
    this.log('\n🚀 To start developing:', 'magenta');
    this.log(`   cd ${path.basename(this.installPath)}`, 'yellow');
    this.log('   npm run dev', 'yellow');
    this.log('\n📱 Features included:', 'magenta');
    this.log('   • Mobile-first responsive design', 'green');
    this.log('   • Interactive candy & ice cream tracker', 'green');
    this.log('   • Location reporting system', 'green');
    this.log('   • Real-time filtering and search', 'green');
    this.log('   • Touch-optimized UI', 'green');
    this.log('\n🌐 Open http://localhost:5173 in your browser', 'cyan');
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  }

  async install() {
    try {
      this.log('🍭🍦 Sweet Tracker Installer', 'magenta');
      this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
      
      // Check prerequisites
      if (!(await this.checkPrerequisites())) {
        process.exit(1);
      }
      
      // Get project details
      await this.getProjectDetails();
      
      // Create project
      if (!(await this.createProject())) {
        process.exit(1);
      }
      
      // Install dependencies
      if (!(await this.installDependencies())) {
        process.exit(1);
      }
      
      // Setup Tailwind
      if (!(await this.setupTailwind())) {
        process.exit(1);
      }
      
      // Create project files
      if (!this.createProjectFiles()) {
        process.exit(1);
      }
      
      // Run post-install setup
      await this.runPostInstallSetup();
      
      // Show completion message
      await this.showCompletionMessage();
      
    } catch (error) {
      this.log(`❌ Installation failed: ${error.message}`, 'red');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  getAppContent() {
    return `import React, { useState, useEffect } from 'react';
import { MapPin, Search, Plus, Menu, X, Filter, Star, Clock, DollarSign } from 'lucide-react';
import ReportModal from './components/ReportModal';

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
    timestamp: new Date('2024-01-15T10:30:00')
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
    timestamp: new Date('2024-01-14T15:45:00')
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
    timestamp: new Date('2024-01-13T12:20:00')
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
    timestamp: new Date('2024-01-12T16:10:00')
  }
];

function App() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [filter, setFilter] = useState<'all' | 'candy' | 'ice_cream'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleAddLocation = (newLocation: Omit<Location, 'id' | 'timestamp'>) => {
    const location: Location = {
      ...newLocation,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setLocations([...locations, location]);
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
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
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
                  className={\`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors \${
                    filter === key
                      ? 'bg-white text-pink-500 font-medium'
                      : 'bg-white/20 hover:bg-white/30'
                  }\`}
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
              className={\`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors \${
                filter === key
                  ? 'bg-white text-pink-500 font-medium'
                  : 'bg-white/20 hover:bg-white/30'
              }\`}
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
                    className={\`\${getTypeColor(location.type)} text-white p-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all\`}
                  >
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
        <div className={\`
          fixed md:relative top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out
          \${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          md:w-80 md:block
        \`}>
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
                      className={\`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md \${
                        selectedLocation?.id === location.id
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }\`}
                      onClick={() => setSelectedLocation(location)}
                    >
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
                        <div className={\`px-2 py-1 rounded-full text-xs font-medium \${
                          location.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }\`}>
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
    </div>
  );
}

export default App;`;
  }

  getReportModalContent() {
    return `import React, { useState } from 'react';
import { X, MapPin, Star, DollarSign, Clock } from 'lucide-react';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (location: {
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
  }) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'ice_cream' as 'candy' | 'ice_cream',
    rating: 4,
    priceRange: '$' as '$' | '$$' | '$$$',
    hours: '',
    isOpen: true,
    description: '',
    reportedBy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate random coordinates near NYC for demo
    const lat = 40.7589 + (Math.random() - 0.5) * 0.02;
    const lng = -73.9851 + (Math.random() - 0.5) * 0.02;
    
    onSubmit({
      ...formData,
      lat,
      lng
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">Report Sweet Spot</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., Sweet Dreams Candy Shop"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'candy' })}
                className={\`p-3 rounded-lg border-2 transition-all \${
                  formData.type === 'candy'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }\`}
              >
                <div className="text-2xl mb-1">🍭</div>
                <div className="text-sm font-medium">Candy Store</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'ice_cream' })}
                className={\`p-3 rounded-lg border-2 transition-all \${
                  formData.type === 'ice_cream'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-gray-200 hover:border-gray-300'
                }\`}
              >
                <div className="text-2xl mb-1">🍦</div>
                <div className="text-sm font-medium">Ice Cream</div>
              </button>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={\`\${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } transition-colors\`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '$', label: 'Budget', desc: 'Under $10' },
                { value: '$$', label: 'Moderate', desc: '$10-25' },
                { value: '$$$', label: 'Premium', desc: '$25+' }
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priceRange: value as any })}
                  className={\`p-2 rounded-lg border-2 transition-all text-center \${
                    formData.priceRange === value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }\`}
                >
                  <div className="font-bold text-lg">{value}</div>
                  <div className="text-xs">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="e.g., 9AM - 9PM"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOpen: true })}
                className={\`p-2 rounded-lg border-2 transition-all \${
                  formData.isOpen
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }\`}
              >
                <div className="text-sm font-medium">Open</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOpen: false })}
                className={\`p-2 rounded-lg border-2 transition-all \${
                  !formData.isOpen
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }\`}
              >
                <div className="text-sm font-medium">Closed</div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="What makes this place special?"
            />
          </div>

          {/* Reporter Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Your username"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Sweet Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;`;
  }

  getIndexCssContent() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Touch-friendly tap targets */
@media (max-width: 768px) {
  button, a, input, textarea, select {
    min-height: 44px;
    min-width: 44px;
  }
  
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Smooth transitions for mobile interactions */
* {
  -webkit-tap-highlight-color: transparent;
}

button:active {
  transform: scale(0.98);
}

/* Improved focus states for accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Mobile-specific improvements */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .sidebar-mobile {
    width: 100vw;
    max-width: 400px;
  }
  
  /* Prevent zoom on input focus on iOS */
  input[type="text"],
  input[type="email"],
  input[type="number"],
  textarea,
  select {
    font-size: 16px;
  }
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Smooth animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}`;
  }

  getTailwindConfigContent() {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}`;
  }

  getReadmeContent() {
    return `# 🍭🍦 Sweet Tracker

A mobile-first web application for tracking candy stores and ice cream shops, similar to Waze but for sweet treats!

## Features

- 📱 **Mobile-First Design** - Optimized for touch interactions and mobile devices
- 🗺️ **Interactive Map Interface** - Visual representation of sweet spot locations
- 🔍 **Smart Search & Filtering** - Find exactly what you're craving
- ➕ **Community Reporting** - Add new locations with detailed information
- ⭐ **Rating System** - Rate and review your favorite spots
- 🕒 **Real-Time Status** - See which places are currently open
- 💰 **Price Range Indicators** - Know what to expect before you go

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd sweet-tracker
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:5173\`

## Usage

### Adding a New Location

1. Click the **+** button in the header
2. Fill out the location details:
   - Business name
   - Type (Candy Store or Ice Cream)
   - Rating (1-5 stars)
   - Price range ($, $$, $$$)
   - Hours of operation
   - Current status (Open/Closed)
   - Description
   - Your name

### Searching and Filtering

- Use the search bar to find specific locations
- Filter by type: All, Candy Stores, or Ice Cream shops
- Results update in real-time as you type

### Mobile Navigation

- **Hamburger Menu**: Access the sidebar on mobile devices
- **Touch-Optimized**: All buttons and interactions are designed for touch
- **Responsive Design**: Works seamlessly across all screen sizes

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Mobile-First Responsive Design**

## Project Structure

\`\`\`
src/
├── components/
│   └── ReportModal.tsx    # Modal for adding new locations
├── App.tsx                # Main application component
├── index.css             # Global styles and Tailwind imports
└── main.tsx              # Application entry point
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## Future Enhancements

- 🗺️ Real map integration (Google Maps, Mapbox)
- 📍 GPS location services
- 👥 User accounts and profiles
- 📸 Photo uploads for locations
- 🔔 Push notifications for nearby sweet spots
- 📊 Analytics and insights
- 🌐 PWA (Progressive Web App) support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Waze's community-driven approach
- Built with modern web technologies for optimal performance
- Designed with accessibility and mobile-first principles

---

**Happy Sweet Hunting!** 🍭🍦`;
  }

  getGitignoreContent() {
    return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  }
}

// Run the installer
const installer = new SweetTrackerInstaller();
installer.install().catch(console.error);