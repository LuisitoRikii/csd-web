import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Outlet />
    </div>
  )
}
