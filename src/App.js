import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/login';
import Navbar from './components/navbar';
import FormsPage from './pages/forms';
import AllocationForm from './pages/allocation';
import IndividualSectionForm from './pages/induvidualsectionform';
import MultipleSectionForm from './pages/multiplesectionform';
import Account2Form from './pages/account2';
import Account3Form from './pages/account3';
import Account4Form from './pages/account4';
import Account56Form from './pages/account56';
import Account6Form from './pages/account6';
import Account7Form from './pages/account7';
import ApprovalForm from './pages/approvalformat';
import ObjectionFormPage from './pages/objectionformat';
import UserApprovalPage from './pages/Userapproval';
import IndividualFeeCommitteeForm from './components/induvidual-form';

// Protected Route Component with improved authentication check
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      
      if (!isAuthenticated || !loginResponse?.output?.data) {
        // Clear any stale data
        localStorage.clear();
        navigate('/', { replace: true });
      }
    };

    // Initial check
    checkAuth();
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');

  if (!isAuthenticated || !loginResponse?.output?.data) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin-only route component
const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.userType === 'Admin';
  
  if (!isAdmin) {
    return <Navigate to="/forms" replace />;
  }
  
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

// Layout Component with authentication check
const Layout = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

// New component for the form view/edit page
const FormViewEditPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <IndividualFeeCommitteeForm formType="Individual" />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login Page with thorough authentication check */}
        <Route 
          path="/" 
          element={
            (() => {
              const isAuth = localStorage.getItem('isAuthenticated') === 'true';
              const loginData = JSON.parse(localStorage.getItem('loginResponse') || '{}');
              
              // Only redirect if both conditions are true
              if (isAuth && loginData?.output?.data) {
                return <Navigate to="/forms" replace />;
              }
              
              // Otherwise show login page
              return <LoginPage />;
            })()
          } 
        />

        {/* Admin-only route for user approval */}
        <Route
          path="/user-approval"
          element={
            <AdminRoute>
              <Layout>
                <UserApprovalPage />
              </Layout>
            </AdminRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <Layout>
                <FormsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account7"
          element={
            <ProtectedRoute>
              <Layout>
                <Account7Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account56"
          element={
            <ProtectedRoute>
              <Layout>
                <Account56Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account6"
          element={
            <ProtectedRoute>
              <Layout>
                <Account6Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/form2"
          element={
            <ProtectedRoute>
              <Layout>
                <Account2Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account3"
          element={
            <ProtectedRoute>
              <Layout>
                <Account3Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/approve"
          element={
            <ProtectedRoute>
              <Layout>
                <ApprovalForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/objection"
          element={
            <ProtectedRoute>
              <Layout>
                <ObjectionFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account4"
          element={
            <ProtectedRoute>
              <Layout>
                <Account4Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Add the new route for form view/edit */}
        <Route
          path="/form-view-edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FormViewEditPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/individual-section-form/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <IndividualSectionForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/multiple-section-form/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MultipleSectionForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/allocate"
          element={
            <ProtectedRoute>
              <Layout>
                <AllocationForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;