import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Visitors from "./pages/Visitors";
import VisitorDetail from "./pages/VisitorDetail";
import Contacts from "./pages/Contacts";
import UpdateContent from "./pages/UpdateContent";
import Preview from "./pages/Preview";

// ── Layout wraps every protected page with sidebar + navbar ──────────────
function AdminLayout({ children, fullHeight }) {
  return (
    <div className={`flex bg-slate-50 dark:bg-surface transition-colors duration-300 ${fullHeight ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div className={`flex-1 ml-64 flex flex-col ${fullHeight ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        {/* Fixed top navbar */}
        <Navbar />

        {/* Page content — padded below the navbar */}
        <main className={`flex-1 pt-14 ${fullHeight ? "flex flex-col min-h-0 overflow-hidden" : ""}`}>
          <div className={`w-full px-6 py-5 ${fullHeight ? "flex-1 flex flex-col min-h-0 overflow-hidden" : ""}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AdminLayout><Analytics /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/visitors" element={
              <ProtectedRoute>
                <AdminLayout><Visitors /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/visitors/:sessionId" element={
              <ProtectedRoute>
                <AdminLayout><VisitorDetail /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <AdminLayout><Contacts /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/update" element={
              <ProtectedRoute>
                <AdminLayout><UpdateContent /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/preview" element={
              <ProtectedRoute>
                <AdminLayout fullHeight>
                  <Preview />
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
