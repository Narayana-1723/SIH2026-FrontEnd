import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { AuthLayout } from '../layouts/AuthLayout';
import { UserLayout } from '../layouts/UserLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import { Login } from '../pages/auth/Login';

// User Pages
import { UserDashboard } from '../pages/user/Dashboard';
import { Materials } from '../pages/user/Materials';
import { MaterialDetails } from '../pages/user/MaterialDetails';
import { UploadMaterials } from '../pages/user/UploadMaterials';
import { Harmonization } from '../pages/user/Harmonization';
import { MatchResults } from '../pages/user/MatchResults';
import { Duplicates } from '../pages/user/Duplicates';
import { ReviewQueue } from '../pages/user/ReviewQueue';
import { Taxonomy } from '../pages/user/Taxonomy';
import { CanonicalMaterials } from '../pages/user/CanonicalMaterials';
import { Analytics as UserAnalytics } from '../pages/user/Analytics';
import { Reports } from '../pages/user/Reports';

// Admin Pages
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminUsers } from '../pages/admin/Users';
import { AdminMaterials } from '../pages/admin/Materials';
import { AdminDataManagement } from '../pages/admin/DataManagement';
import { AdminTaxonomyManagement } from '../pages/admin/TaxonomyManagement';
import { AdminReviewManagement } from '../pages/admin/ReviewManagement';
import { AdminCanonicalManagement } from '../pages/admin/CanonicalManagement';
import { AdminModelStatus } from '../pages/admin/ModelStatus';
import { AdminAnalytics } from '../pages/admin/Analytics';
import { AdminAuditLogs } from '../pages/admin/AuditLogs';
import { AdminSystemSettings } from '../pages/admin/SystemSettings';

// Root Redirect Helper
const RootRedirect: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Redirection */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public / Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* User Portal Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="materials" element={<Materials />} />
        <Route path="materials/:id" element={<MaterialDetails />} />
        <Route path="upload" element={<UploadMaterials />} />
        <Route path="harmonization" element={<Harmonization />} />
        <Route path="harmonization/:id" element={<Harmonization />} />
        <Route path="matches" element={<MatchResults />} />
        <Route path="duplicates" element={<Duplicates />} />
        <Route path="review-queue" element={<ReviewQueue />} />
        <Route path="taxonomy" element={<Taxonomy />} />
        <Route path="canonical-materials" element={<CanonicalMaterials />} />
        <Route path="canonical-materials/:id" element={<CanonicalMaterials />} />
        <Route path="analytics" element={<UserAnalytics />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Admin Portal Routes (Guarded by RoleRoute) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="data-management" element={<AdminDataManagement />} />
        <Route path="taxonomy" element={<AdminTaxonomyManagement />} />
        <Route path="reviews" element={<AdminReviewManagement />} />
        <Route path="canonical-materials" element={<AdminCanonicalManagement />} />
        <Route path="model-status" element={<AdminModelStatus />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSystemSettings />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
