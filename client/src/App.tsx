import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  AuthContext,
  useAuthProvider,
  RestaurantContext,
  useRestaurantProvider,
  useAuth } from
'./lib/store';
import { Toaster } from './components/ui/Sonner';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { MenuManagement } from './pages/manager/MenuManagement';
import { StaffManagement } from './pages/manager/StaffManagement';
import { OrderManagement } from './pages/manager/OrderManagement';
import { TableManagement } from './pages/manager/TableManagement';
import { WaiterDashboard } from './pages/waiter/WaiterDashboard';
import { OrderCreation } from './pages/waiter/OrderCreation';
import { KitchenDashboard } from './pages/kitchen/KitchenDashboard';
import { Loader2 } from 'lucide-react';
// Auth guard - redirects to login if not authenticated
function AuthGuard({ children }: {children: React.ReactNode;}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>);

  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
// Role-based route guard
function ProtectedRoute({
  children,
  allowedRoles



}: {children: React.ReactNode;allowedRoles: string[];}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>);

  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access unauthorized route
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
// Smart dashboard router based on role
function DashboardRouter() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'manager':
      return <ManagerDashboard />;
    case 'waiter':
      return <WaiterDashboard />;
    case 'kitchen':
      return <KitchenDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}
export function App() {
  const auth = useAuthProvider();
  const restaurant = useRestaurantProvider();
  return (
    <AuthContext.Provider value={auth}>
      <RestaurantContext.Provider value={restaurant}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/"
              element={
              <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }>
              
              <Route index element={<DashboardRouter />} />

              {/* Manager Routes */}
              <Route
                path="orders"
                element={
                <ProtectedRoute allowedRoles={['manager']}>
                    <OrderManagement />
                  </ProtectedRoute>
                } />
              
              <Route
                path="tables"
                element={
                <ProtectedRoute allowedRoles={['manager']}>
                    <TableManagement />
                  </ProtectedRoute>
                } />
              
              <Route
                path="menu"
                element={
                <ProtectedRoute allowedRoles={['manager']}>
                    <MenuManagement />
                  </ProtectedRoute>
                } />
              
              <Route
                path="staff"
                element={
                <ProtectedRoute allowedRoles={['manager']}>
                    <StaffManagement />
                  </ProtectedRoute>
                } />
              

              {/* Waiter Routes */}
              <Route
                path="table/:tableId"
                element={
                <ProtectedRoute allowedRoles={['waiter']}>
                    <OrderCreation />
                  </ProtectedRoute>
                } />
              
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
        <Toaster position="top-right" richColors />
      </RestaurantContext.Provider>
    </AuthContext.Provider>);

}