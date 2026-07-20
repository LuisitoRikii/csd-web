import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AdminShell } from '@/components/admin/AdminShell'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AboutPage } from '@/pages/AboutPage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogDetailPage } from '@/pages/BlogDetailPage'
import { ContactPage } from '@/pages/ContactPage'
import { QuotePage } from '@/pages/QuotePage'
import { AppointmentPage } from '@/pages/AppointmentPage'

import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminQuotesPage } from '@/pages/admin/AdminQuotesPage'
import { AdminAppointmentsPage } from '@/pages/admin/AdminAppointmentsPage'
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage'
import { AdminMessagesPage } from '@/pages/admin/AdminMessagesPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { AdminFilesPage } from '@/pages/admin/AdminFilesPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              
                <AdminProjectsPage />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              
                <AdminCategoriesPage />
      
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <ProtectedRoute>
              
                <AdminQuotesPage />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              
                <AdminAppointmentsPage />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <ProtectedRoute>
              
                <AdminBlogPage />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              
                <AdminMessagesPage />
              
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/files"
          element={
            <ProtectedRoute>
              <AdminFilesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
