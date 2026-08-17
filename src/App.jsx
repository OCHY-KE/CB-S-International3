import { useState } from 'react'
import './App.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer' // New Component
import AdminPage from './AdminPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  // 1. Handle Admin View
  if (isAdminLoggedIn) {
    return <AdminPage onBack={() => setIsAdminLoggedIn(false)} />
  }

  // 2. Page Content Switcher
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'admin-login': return <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />;
      case 'user-login': return <UserLogin onLoginSuccess={() => setCurrentPage('home')} />;
      default: return <HomePage />;
    }
  }

  return (
    <div className="page-shell">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer is now global or conditionally hidden on login pages */}
      {currentPage !== 'admin-login' && currentPage !== 'user-login' && <Footer />}
    </div>
  )
}

export default App