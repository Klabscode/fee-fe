import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Clock, Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Check authentication status on mount and route changes
    const checkAuth = () => {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (!loginResponse?.output?.data) {
        // If no valid login data, redirect to login
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
        return;
      }
      
      setIsAdmin(loginResponse?.output?.data?.userType === 'Admin');
      setUserData(userDataFromStorage);
    };

    checkAuth();
    
    // Set up clock timer
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate, location]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleLogout = async () => {
    try {
      // First set auth status to false
      localStorage.setItem('isAuthenticated', 'false');
      
      // Reset all states first
      setIsAdmin(false);
      setUserData({});
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      
      // Clear remaining localStorage items
      localStorage.removeItem('loginResponse');
      localStorage.removeItem('userData');
      localStorage.clear();
      
      // Navigate last, after all cleanup is done
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure navigation happens even if there's an error
      localStorage.clear();
      navigate('/', { replace: true });
    }
  };

  const handleNavigation = (path) => {
    // Check if user is still authenticated before navigation
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
    
    if (!isAuthenticated || !loginResponse?.output?.data) {
      navigate('/', { replace: true });
      return;
    }
    
    navigate(path);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700">
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
      
      {/* Main Navbar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex-shrink-0">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">Tamil Nadu Government</h1>
              <span className="text-xs text-blue-100">Fee Committee</span>
            </div>
          </div>

          {/* Desktop Clock */}
          <div className="hidden lg:flex flex-col items-center bg-blue-800/30 px-4 py-1 rounded-lg">
            <div className="flex items-center space-x-3 text-blue-100">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">{formatDate(currentTime)}</span>
            </div>
            <span className="text-lg font-semibold text-white">{formatTime(currentTime)}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => handleNavigation('/home')}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleNavigation('/forms')}
              className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Forms</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavigation('/allocate')}
                className="text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Allocation</span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-white hover:bg-blue-600 px-3 py-2 rounded-md"
              >
                <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{userData.userName || 'User'}</p>
                  <p className="text-xs text-blue-200">{userData.userType || 'Role'}</p>
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-blue-600"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {/* Mobile Clock */}
            <div className="border-b border-blue-700 pb-2 mb-2">
              <div className="flex items-center space-x-2 text-white">
                <Clock className="h-5 w-5" />
                <div>
                  <div className="text-sm">{formatDate(currentTime)}</div>
                  <div className="text-sm font-semibold">{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <button
              onClick={() => handleNavigation('/home')}
              className="w-full text-left text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavigation('/forms')}
              className="w-full text-left text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Forms</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavigation('/allocate')}
                className="w-full text-left text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Allocation</span>
              </button>
            )}

            {/* Mobile Profile Section */}
            <div className="border-t border-blue-700 pt-4 mt-4">
              <div className="flex items-center px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="text-white">
                  <p className="font-medium">{userData.userName || 'User'}</p>
                  <p className="text-sm text-blue-200">{userData.userType || 'Role'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;