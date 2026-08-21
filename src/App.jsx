import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary' // new import
import SEO from './components/SEO'
import Breadcrumb from './components/Breadcrumb'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy loaded pages
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AdminGallery = lazy(() => import('./pages/AdminGallery'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const UserLogin = lazy(() => import('./pages/UserLogin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Gallery = lazy(() => import('./pages/Gallery'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const Profile = lazy(() => import('./pages/Profile'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

function AppContent() {
  const location = useLocation();
  const authRoutes = ['/login', '/admin-login', '/create-account'];
  const isLoginPage = authRoutes.includes(location.pathname.toLowerCase());

  return (
    <div className="app-container">
      <Navbar />
      <Breadcrumb />

      <main>
        <ErrorBoundary>
          <Suspense fallback={<div className="loader">Loading page...</div>}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Auth routes */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes (Private & Role Protected) */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/admin-dashboard"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin-gallery"
                element={
                  <AdminRoute>
                    <AdminGallery />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SEO />
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}

export default App