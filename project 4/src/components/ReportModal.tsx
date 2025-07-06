import React, { useState } from 'react';
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
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'candy'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🍭</div>
                <div className="text-sm font-medium">Candy Store</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'ice_cream' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'ice_cream'
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
                    className={`${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } transition-colors`}
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
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    formData.priceRange === value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
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
                className={`p-2 rounded-lg border-2 transition-all ${
                  formData.isOpen
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">Open</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOpen: false })}
                className={`p-2 rounded-lg border-2 transition-all ${
                  !formData.isOpen
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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

export default ReportModal;