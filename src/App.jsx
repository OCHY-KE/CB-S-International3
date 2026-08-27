import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import Breadcrumb from './components/Breadcrumb';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './App.css';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Itineraries = lazy(() => import('./pages/Itineraries'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const CreateAccount = lazy(() => import('./pages/CreateAccount'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const ItinerariesAdmin = lazy(() => import('./pages/ItinerariesAdmin'));

const ItineraryReader = lazy(() => import('./pages/ItineraryReader')); // Add this

// --- Layout Components ---

const PublicLayout = () => (
  <div className="layout-root">
    <Navbar />
    <Breadcrumb />
    <main className="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AdminLayout = () => (
  <div className="layout-root admin-bg">
    <main className="main-content admin-container">
      <Outlet />
    </main>
  </div>
);

const AuthLayout = () => (
  <div className="layout-root auth-bg">
    <main className="main-content center-content">
      <Outlet />
    </main>
  </div>
);

const PageLoader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <SEO />
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* 1. Public Routes */}
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="itineraries" element={<Itineraries />} />

                {/* ADD THIS NEW ROUTE */}
                <Route path="itineraries/:id" element={<ItineraryReader />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 2. Auth Routes (No Navbar/Footer) */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<UserLogin />} />
                <Route path="create-account" element={<CreateAccount />} />
                <Route path="admin-login" element={<AdminLogin />} />
              </Route>

              {/* 3. Admin Routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminPage />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="itineraries" element={<ItinerariesAdmin />} />
              </Route>

              {/* 4. Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;