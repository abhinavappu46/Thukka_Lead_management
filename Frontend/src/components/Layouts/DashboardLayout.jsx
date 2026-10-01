import { Outlet } from "react-router-dom"
import TopBar from "./TopBar"
import Sidebar from "./sidebar"
import "./DashboardLayout.css"

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <TopBar />
        </header>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default DashboardLayout