import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Lazy loaded pages
const AdminPage = lazy(() => import('./AdminPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const Login = lazy(() => import('./pages/UserLogin'))

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main>
          <Suspense fallback={<div className="loader">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<Login defaultMode="user" />} />
              <Route path="/user-login" element={<Login defaultMode="user" />} />
              <Route path="/admin-login" element={<Login defaultMode="admin" />} />
              <Route path="/admin-dashboard" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
