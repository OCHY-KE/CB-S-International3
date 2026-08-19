import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary' // new import

// Lazy loaded pages
const AdminPage = lazy(() => import('./pages/AdminPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const UserLogin = lazy(() => import('./pages/UserLogin'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const Gallery = lazy(() => import('./pages/Gallery'))
const CreateAccount = lazy(() => import('./pages/CreateAccount'))
const Profile = lazy(() => import('./pages/Profile'))

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />

        <main>
          <ErrorBoundary>
            <Suspense fallback={<div className="loader">Loading page...</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gallery" element={<Gallery />} />

                {/* Auth routes */}
                <Route path="/login" element={<UserLogin />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminPage />} />

                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
