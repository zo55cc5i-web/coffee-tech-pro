import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// --- الإضافات الجديدة هنا لربط الصفحات ---
import MaintenanceForm from './components/MaintenanceForm'
import Services from './components/Services'
// ---------------------------------------

/* =========================
    🔐 حماية الصفحات
========================= */
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

/* =========================
    🚫 منع الدخول لـ login لو مسجل
========================= */
function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/* =========================
    🚫 صفحة 404
========================= */
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600">الصفحة غير موجودة</p>
    </div>
  )
}

/* =========================
    🧠 App
========================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 الصفحة الرئيسية */}
        <Route path="/" element={<Home />} />

        {/* 🛠️ صفحة طلب صيانة (المسار المضاف) */}
        <Route path="/maintenance" element={<MaintenanceForm />} />

        {/* 🛒 صفحة الخدمات أو المنتجات (المسار المضاف) */}
        <Route path="/services" element={<Services />} />

        {/* 🔐 تسجيل الدخول (لو مش مسجل فقط) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🛡️ الداشبورد محمية */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🚫 أي رابط غلط */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App