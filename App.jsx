import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js' // ضفنا .js هنا

// التعديل النهائي: ضفنا .jsx لكل الملفات عشان Vite ميتوهش
import Home from './Home.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import MaintenanceForm from './MaintenanceForm.jsx'
import Services from './Services.jsx'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
        <span className="mr-3">جاري التحميل...</span>
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
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>
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
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600">عذراً، هذه الصفحة غير موجودة</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">العودة للرئيسية</a>
    </div>
  )
}

/* =========================
    🧠 App
========================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 الصفحة الرئيسية */}
        <Route path="/" element={<Home />} />

        {/* 🛠️ صفحة طلب صيانة */}
        <Route path="/maintenance" element={<MaintenanceForm />} />

        {/* 🛒 صفحة الخدمات */}
        <Route path="/services" element={<Services />} />

        {/* 🔐 تسجيل الدخول */}
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
