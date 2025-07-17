import React, { useState } from 'react';
import { User, Building, Mail, Calendar, Trash2, LogOut, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/**
 * User profile component with account management
 */
const UserProfile: React.FC = () => {
  const { user, userProfile, signOut, deleteAccount, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userProfile?.displayName || '',
    farmName: userProfile?.farmName || '',
    location: userProfile?.location || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAccount();
      if (!result.success) {
        alert(result.error || 'Failed to delete account');
      }
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 flex items-center space-x-1"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 p-1 shadow-lg">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <img 
                src="/OAUSTECH LOGO.png" 
                alt="OAUSTECH Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{userProfile.displayName}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-blue-600">OAUSTECH Member</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-900">{userProfile.displayName}</span>
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-900">{user.email}</span>
            </div>
          </div>

          {/* Farm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.farmName}
                onChange={(e) => setEditData({ ...editData, farmName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter farm name"
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <Building size={16} className="text-gray-400" />
                <span className="text-gray-900">{userProfile.farmName || 'Not specified'}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location"
              />
            ) : (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-900">{userProfile.location || 'Not specified'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Account created:</span>
            <span>{new Date(userProfile.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
            <span>Institution:</span>
            <span className="text-blue-600">OAUSTECH</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;