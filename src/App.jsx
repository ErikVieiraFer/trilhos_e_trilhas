import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PageLoader } from './components/common/LoadingSpinner'

// Public Pages
import Home from './pages/Home'

// Admin Pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Viagens from './pages/admin/Viagens'
import NovaViagem from './pages/admin/NovaViagem'
import EditarViagem from './pages/admin/EditarViagem'
import Galeria from './pages/admin/Galeria'
import Configuracoes from './pages/admin/Configuracoes'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Public Only Route (redirect if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <PageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      {/* Admin Routes */}
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/viagens"
        element={
          <ProtectedRoute>
            <Viagens />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/viagens/nova"
        element={
          <ProtectedRoute>
            <NovaViagem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/viagens/:id/editar"
        element={
          <ProtectedRoute>
            <EditarViagem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/galeria"
        element={
          <ProtectedRoute>
            <Galeria />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/configuracoes"
        element={
          <ProtectedRoute>
            <Configuracoes />
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e3a5f',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            },
            success: {
              iconTheme: {
                primary: '#22d3ee',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#f472b6',
                secondary: '#fff'
              }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
